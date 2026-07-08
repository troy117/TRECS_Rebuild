package photo.software.QRevent;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JOptionPane;

import org.apache.commons.lang.RandomStringUtils;

import photo.software.comparators.QREventReferenceSortComparator;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;

import com.healthmarketscience.jackcess.CursorBuilder;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.IndexCursor;
import com.healthmarketscience.jackcess.Row;
import com.healthmarketscience.jackcess.Table;

public class QRstudents 
{
	private ArrayList<QRstudent> students;
	
	private Database db;
	private Table table;
	public QRstudent current;
	public int currentIndex;
	public String fallPath,website;
	
	public QRstudents(DesktopWindow window, JobData job)
	{
		students = new ArrayList<QRstudent>();
		File file = new File(window.jobs+"\\"+job.location+"\\"+job.job+"\\Database\\QREvents.accdb");
		try
		{
			db = DatabaseBuilder.open(file);
			table = db.getTable("FallJob");
			try{fallPath = table.getNextRow().getString("FallJobPath").toString();}catch(NullPointerException e){fallPath = "";}
			
			table = db.getTable("Website");
			try{website = table.getNextRow().getString("WebsitePrefix").toString();}catch(NullPointerException e){website = "";}
			
			table = db.getTable("Students");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Student database!: "+e);return;}
	}
	
	public boolean openStudentDatabase()
	{
		try
		{
			String[] temp = new String[8];
			for(Row row:table)
			{
				try{temp[0] = row.get("RefNum").toString();}catch(NullPointerException e){temp[0]="-1";}
				try{temp[1] = row.get("Image").toString();}catch(NullPointerException e){temp[1]="";}
				try{temp[2] = row.get("First").toString();}catch(NullPointerException e){temp[2]="";}
				try{temp[3] = row.get("Last").toString();}catch(NullPointerException e){temp[3]="";}
				try{temp[4] = row.get("Homeroom").toString();}catch(NullPointerException e){temp[4]="";}
				try{temp[5] = row.get("Order").toString();}catch(NullPointerException e){temp[5]="";}
				try{temp[6] = row.get("Notes").toString();}catch(NullPointerException e){;temp[6]="";}
				try{temp[7] = row.get("Rand").toString();}catch(NullPointerException e){;temp[7]="";}
				
				
				students.add(new QRstudent(temp[0],temp[1],temp[2],temp[3],temp[4],temp[5],temp[6],temp[7]));
			}
			Collections.sort(students, new QREventReferenceSortComparator());
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error somewhere loading student data.");return false;}
		return true;
	}
	public String randomChars()
	{
		return RandomStringUtils.randomAlphabetic(8);
	}
	public void addBlank(int blankNum)
	{
		try
		{
			String rand;
			long lastRef = Long.parseLong(students.get(students.size()-1).ref);
			for(int i=0;i<blankNum;i++)
			{
				rand = randomChars();
				table.addRow(lastRef+1+i+"","","","","","","",rand);
				students.add(new QRstudent(lastRef+1+i+"",rand));				
				
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Adding Blank: "+e);}
		
		
	}
	public void next()
	{
		if(currentIndex<students.size()-1) currentIndex++;
		else currentIndex=0;
		current = students.get(currentIndex);
	}
	public void previous()
	{
		if(currentIndex>0) currentIndex--;
		else currentIndex=students.size()-1;
		current = students.get(currentIndex);
	}
	public int size()
	{
		return students.size();
	}
	public int getLastRefNum()
	{
		return Integer.parseInt(students.get(students.size()-1).ref);
	}
	public boolean updateImage(String image, String number, String homeroom)
	{
		for(QRstudent s:students)
		{
			if(Integer.parseInt(s.ref)%1000==Integer.parseInt(number))
			{
				s.image = image;
				s.homeroom = homeroom;
				saveStudent(s);
				return true;
			}
		}
		return false;
	}
	public boolean addDuplicateStudentImage(QRstudent duplicate)
	{
		try
		{
			duplicate.ref = getLastRefNum()+1+"";
			table.addRow(duplicate.ref, duplicate.image,duplicate.first,duplicate.last,duplicate.homeroom,duplicate.order,duplicate.notes,duplicate.rand);
			students.add(duplicate);

		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error adding to Table: "+e);return false;}
		return true;
	}
	public boolean addStudents(ArrayList<QRstudent> toAdd)
	{
		for(QRstudent s:toAdd)
		{
			if(students.contains(s))
			{
				JOptionPane.showMessageDialog(null, "Reference number already exists! "+s.ref+" Will not update Database");
				return false;
			}
		}
		try
		{
			for(QRstudent s:toAdd)
			{
				table.addRow(getLastRefNum()+1+"",s.image,s.first,s.last,s.homeroom,s.order,s.notes,s.rand);
				students.add(s);
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error adding to Table: "+e);return false;}
		return true;
	}
	public boolean saveStudent(QRstudent s)
	{
		try
		{
			if(!students.contains(s))
			{
				table.addRow(Long.parseLong(students.get(students.size()-1).ref)+1,s.image,s.first,s.last,s.homeroom,s.order,s.notes,s.rand);
				students.add(s);
				return true;
			}
			else
			{
				IndexCursor cursor = CursorBuilder.createCursor(table.getPrimaryKeyIndex());
				boolean found = cursor.findFirstRow(Collections.singletonMap("RefNum",s.ref));
				if(found)
				{
					cursor.updateCurrentRow(s.ref, s.image,s.first,s.last,s.homeroom,s.order,s.notes,s.rand);
					for(QRstudent stu:students)
					{
						if(stu.equals(s))
						{
							stu = s;
							return true;
						}
					}
				}
			}
		}catch(Exception err){JOptionPane.showMessageDialog(null, "Fail! Unable to add/save missing EventStudent: "+err);}
		return false;
	}
	public ArrayList<QRstudent> getStudents() {return new ArrayList<QRstudent>(students);}
	public QRstudent setCurrentStudent(String ref)
	{
		for(int i=0;i<students.size();i++)
		{
			if(students.get(i).ref.equals(ref))
			{
				current = students.get(i);
				currentIndex = i;
				return current;
			}
		}
		JOptionPane.showMessageDialog(null, "Unable to set Current student to: "+ref);
		return null;
	}
	public void close()
	{
		if(db!=null) try{db.close();db = null;}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Cloing Event Database: "+e);}
	}
	
}
