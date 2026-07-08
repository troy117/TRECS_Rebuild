package photo.software.spring;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JOptionPane;

import photo.software.comparators.SpringReferenceSortComparator;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.student.Student;

import com.healthmarketscience.jackcess.CursorBuilder;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.IndexCursor;
import com.healthmarketscience.jackcess.Row;
import com.healthmarketscience.jackcess.Table;

public class SpringStudents 
{

	private ArrayList<SpringStudent> students;
	
	private File file;
	private Database db;
	private Table table;
	public SpringStudent current;
	public int currentIndex=0;
	public String fallPath;
	public SpringStudents(DesktopWindow window, JobData job)
	{
		students = new ArrayList<SpringStudent>();
		file = new File(window.jobs+"\\"+job.location+"\\"+job.job+"\\Database\\Spring.accdb");
		try
		{
			db = DatabaseBuilder.open(file);
			table = db.getTable("FallJob");
			try{fallPath = table.getNextRow().getString("FallJobPath").toString();}catch(NullPointerException e){fallPath = "";}
			table = db.getTable("Students");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Student Database: "+e);}
	}
	public boolean openStudentDatabase()
	{
		try
		{
			String temp[] = new String[12];
			for(Row row:table)
			{
				try{temp[0] = row.getString("RefNum").toString();}catch(NullPointerException e){temp[0]="-1";}
				try{temp[1] = row.getString("Image").toString();}catch(NullPointerException e){temp[1]="";}
				try{temp[2] = row.getString("Last").toString();}catch(NullPointerException e){temp[2]="";}
				try{temp[3] = row.getString("First").toString();}catch(NullPointerException e){temp[3]="";}
				try{temp[4] = row.getString("Homeroom").toString();}catch(NullPointerException e){temp[4]="";}
				try{temp[5] = row.getString("Grade").toString();}catch(NullPointerException e){temp[5]="";}
				try{temp[6] = row.getString("Order1").toString();}catch(NullPointerException e){temp[6]="";}
				try{temp[7] = row.getString("Order2").toString();}catch(NullPointerException e){temp[7]="";}
				try{temp[8] = row.getString("Notes").toString();}catch(NullPointerException e){temp[8]="";}
				try{temp[9] = row.getString("Text1").toString();}catch(NullPointerException e){temp[9]="";}
				try{temp[10] = row.getString("Text2").toString();}catch(NullPointerException e){temp[10]="";}
				try{temp[11] = row.getString("Text3").toString();}catch(NullPointerException e){temp[11]="";}
				students.add(new SpringStudent(temp[0],temp[1],temp[2],temp[3],temp[4],temp[5],temp[6],temp[7],temp[8],temp[9],temp[10],temp[11]));
			}
			Collections.sort(students, new SpringReferenceSortComparator());
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error somewhere loading student data: "+e);return false;}
		return true;
	}
	public int size()
	{
		return students.size();
	}
	public void close()
	{
		if(db!=null) try {db.close();db=null;}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Closing Database: "+e);}
	}
	public void open()
	{
		if(db==null)
		{
			try
			{
				db = DatabaseBuilder.open(file);
				table = db.getTable("Students");
			}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Student database!: "+e);return;}
		}
	}
	public boolean importOnlineData(ArrayList<String[]> data)
	{
		int count = 0;
		int size = data.size();
		for(SpringStudent s:students)
		{
			for(int i=0;i<data.size();i++)
			{
				String[] d = data.get(i);
				if(s.ref.equals(d[1]))
				{
					s.notes = d[2];
					s.order1 = d[3];
					s.text1 = d[7];
					s.text2 = d[8];
					s.text3 = d[9];
					data.remove(i);
					count++;
					break;
				}
			}
		}
		JOptionPane.showMessageDialog(null, count + " orders of "+size+" succesfully added.");
		if(data.size()>0)
		{
			JOptionPane.showMessageDialog(null, data.size()+" orders not added.");
			String refs = "";
			for(String[] d:data) refs+=d[1]+"\n";
			JOptionPane.showMessageDialog(null, "Orders with the following reference numbers not added:\n"+refs);
		}
		
		updateStudents(students);
		
		return true;
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
	public boolean searchImg(String img)
	{
		String temp;
		for(int i=0;i<students.size();i++)
		{
			temp = students.get(i).img.replace(students.get(i).ref+"_", "");
			if(temp.contains(img))
			{
				currentIndex=i;
				current = students.get(currentIndex);
				return true;
			}
		}
		JOptionPane.showMessageDialog(null, "Unable to load img #: "+img);
		return false;
	}
	public boolean search(String ref)
	{
		for(int i=0;i<students.size();i++)
		{
			if(students.get(i).ref.equals(ref))
			{
				currentIndex=i;
				current = students.get(currentIndex);
				return true;
			}
		}
		JOptionPane.showMessageDialog(null, "Unable to load reference #: "+ref);
		return false;
	}
	public boolean addStudents(ArrayList<SpringStudent> addStudents)
	{
		try
		{
			long lastRef = Long.parseLong(students.get(students.size()-1).ref);
			SpringStudent temp;
			for(int i=0;i<addStudents.size();i++)
			{
				temp = addStudents.get(i);
				temp.ref = lastRef+1+i+"";
				addStudent(temp);
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Adding Blank: "+e);return false;}
		return true;
	}
	public boolean addSpringStudents(ArrayList<Student> fallStudents)
	{
		SpringStudent tempSprStu;
		for(Student s:fallStudents)
		{
			tempSprStu = new SpringStudent(s.ref,s.field1,s.last,s.first,s.homeroom,s.grade,"","","","","","");
			if(!saveStudent(tempSprStu)) return false;
		}
		return true;
	}
	private void addStudent(SpringStudent s) throws IOException
	{
		table.addRow(s.ref,s.img,s.last,s.first,s.homeroom,s.grade,s.order1,s.order2,s.notes,s.text1,s.text2,s.text3);
		students.add(s);
	}
	public void updateStudents(ArrayList<SpringStudent> update)
	{
		for(SpringStudent s:update)
		{
			saveStudent(s);
		}
	}
	public boolean saveStudent(SpringStudent s)
	{
		try
		{
			if(!students.contains(s))
			{
				table.addRow(s.ref,s.img, s.last, s.first, s.homeroom, s.grade, s.order1, s.order2, s.notes, s.text1, s.text2, s.text3);
				students.add(s);
				return true;
			}
			else
			{
				IndexCursor cursor = CursorBuilder.createCursor(table.getPrimaryKeyIndex());
				boolean found = cursor.findFirstRow(Collections.singletonMap("RefNum", Long.parseLong(s.ref)));
				if(found)
				{
					cursor.updateCurrentRow(s.ref, s.img, s.last, s.first, s.homeroom, s.grade, s.order1, s.order2, s.notes, s.text1, s.text2, s.text3);
					for(SpringStudent stu:students)
					{
						if(stu.equals(s))
						{
							stu = s;
							return true;
						}
					}
				}
			}
		}catch(Exception err){JOptionPane.showMessageDialog(null, "Fail! Unable to add/save student: "+err);}
		return false;
	}
	public ArrayList<SpringStudent> getStudents() {return new ArrayList<SpringStudent>(students);}	
	public SpringStudent setCurrentStudent(String ref)
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
		current = students.get(0);
		JOptionPane.showMessageDialog(null, "Unable to set Current student to: "+ref+": Setting ref to: "+students.get(0).ref);
		return current;
	}
	
	
	
}
