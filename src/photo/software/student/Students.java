package photo.software.student;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.swing.JOptionPane;

import org.apache.commons.io.FileUtils;

import com.healthmarketscience.jackcess.Cursor;
import com.healthmarketscience.jackcess.CursorBuilder;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.IndexCursor;
import com.healthmarketscience.jackcess.Row;
import com.healthmarketscience.jackcess.Table;

import photo.software.comparators.ListSortComparator;
import photo.software.comparators.StudentReferenceSortComparator;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.senior.Senior;
import photo.software.senior.UniqueCodeGenerator;
import photo.software.student.lists.ListItem;

public class Students 
{
	private ArrayList<Student> students;
	
	private ArrayList<ListItem> list;
	private ArrayList<String> listNames;
	private File file = null;
	
	private Database db;
	private Table table,listTable;
	public Student current;
	public int currentIndex;
	private JobData job;
	public Students(String onSite)
	{
		students = new ArrayList<Student>();
		file = new File(onSite);
		try
		{
			db = DatabaseBuilder.open(file);
			table = db.getTable("Students");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Student database!: "+e);return;}
	}
	public Students(DesktopWindow window, JobData job)
	{
		this.job = job;
		students = new ArrayList<Student>();
		listNames = new ArrayList<String>();
		file = new File(window.jobs+"\\"+job.location+"\\"+job.job+"\\Database\\Students.accdb");
		
		try
		{
			db = DatabaseBuilder.open(file);
			table = db.getTable("Students");
			listTable = db.getTable("Lists");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Student database!: "+e);return;}
	}
	public Students(File fallData)
	{
		students = new ArrayList<Student>();
		try
		{
			db = DatabaseBuilder.open(fallData);
			table = db.getTable("Students");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Student database!: "+e);return;}
	}
	
	/////////////////List Functions//////////////////////
	
	public void loadListDatabase()
	{
		list = new ArrayList<ListItem>();
		try
		{
			String[] rowValues = new String[2];
			for(Map<String, Object> row:listTable) 
			{
				try{
					rowValues[0] = row.get("List").toString().trim();
				}catch(NullPointerException e){rowValues[0]="";}
				try{
					rowValues[1] = row.get("ReferenceNumber").toString().trim();
				}catch(NullPointerException e){rowValues[1]="";}
				if(rowValues[0].equals("")&&rowValues[1].equals("")) break;
				Student temp = null;
				for(Student s:students)
				{
					if(s.ref.equals(rowValues[1])){
						temp = s;
						break;
					}
				}
				if(temp!=null){
				if(!temp.ref.equals("")) list.add(new ListItem(rowValues[0],temp));
				if(!listNames.contains(rowValues[0])) listNames.add(rowValues[0]);}
			}
		}catch(Error e){JOptionPane.showMessageDialog(null, "Error Loading Lists: "+e);}
	}
	public ArrayList<String> getListNames()
	{
		Collections.sort(listNames);
		return listNames;
	}
	public String[] getListNamesArray()
	{
		Collections.sort(listNames);
		String[] list = new String[listNames.size()];
		for(int i=0;i<list.length;i++) 
		{
			list[i]=listNames.get(i);
		}
		return list;
	}
	public void addStudentToList(String listName, String ref, Boolean duplicatesAllowed)
	{
		try
		{
			Boolean exists = false;
			if(!duplicatesAllowed)
			{
				for(ListItem l:list)
				{
					if(l.getList().equals(listName))
					{
						if(l.getStudent().ref.equals(ref))
						{
							exists = true;
							break;
						}
					}
				}
			}
			if(!exists)
			{
				listTable.addRow(listName,ref);
				list.add(new ListItem(listName,getStudent(ref)));
				if(!listNames.contains(listName)) listNames.add(listName);
			}	

		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Adding Student: "+ref);}
	}
	public void removeStudentFromList(String listName, String ref)
	{
		try
		{
			Map<String,Object> rowPattern = new HashMap<String,Object>();
			rowPattern.put("List", listName);
			rowPattern.put("ReferenceNumber", ref);
			Cursor curse = CursorBuilder.createCursor(listTable);
			curse.findFirstRow(rowPattern);
			curse.deleteCurrentRow();
			for(ListItem l:list)
			{
				if(l.getList().equals(listName))
				{
					if(l.getStudent().ref.equals(ref))
					{
						list.remove(l);
						removeList(listName);
						break;
					}
				}
			}

		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Removing Student");}
	}
	private void removeList(String listName)
	{
		for(ListItem l:list)
		{
			if(l.getList().equals(listName)) return;
		}
		listNames.remove(listName);
	}
	public ArrayList<ListItem> getListItems()
	{
		Collections.sort(list,new ListSortComparator());
		return new ArrayList<ListItem>(list);
	}
	public ArrayList<Student> getStudentsFromList(String listName)
	{
		ArrayList<Student> studentsInList = new ArrayList<Student>();
		for(ListItem l:list)
		{
			if(l.getList().equals(listName)) studentsInList.add(l.getStudent());
		}
		return studentsInList;
	}
	public Student getStudent(String ref)
	{
		for(Student s:students)
			if(s.ref.equals(ref))
				return s;
		return null;
	}
	
	
	/////////////////Student Functions///////////////////
	public boolean openStudentDatabase()
	{
		try
		{
			String[] temp = new String[15];
			for(Row row:table)
			{
				try{temp[0] = row.get("RefNum").toString();}catch(NullPointerException e){temp[0]="-1";}
				try{temp[1] = row.get("First").toString();}catch(NullPointerException e){temp[1]="";}
				try{temp[2] = row.get("Last").toString();}catch(NullPointerException e){temp[2]="";}
				try{temp[3] = row.get("StuID").toString();}catch(NullPointerException e){temp[3]="";}
				try{temp[4] = row.get("Grade").toString();}catch(NullPointerException e){temp[4]="";}
				try{temp[5] = row.get("Homeroom").toString();}catch(NullPointerException e){temp[5]="";}
				try{temp[6] = row.get("Track").toString();}catch(NullPointerException e){temp[6]="";}
				try{temp[7] = row.get("Photo").toString();}catch(NullPointerException e){temp[7]="FALSE";}
				try{temp[8] = row.get("Field1").toString();}catch(NullPointerException e){temp[8]="";}
				try{temp[9] = row.get("Field2").toString();}catch(NullPointerException e){temp[9]="";}
				try{temp[10] = row.get("Notes").toString();}catch(NullPointerException e){temp[10]="";}
				try{temp[11] = row.get("Order1").toString();}catch(NullPointerException e){temp[11]="";}
				try{temp[12] = row.get("Order1Pay").toString();}catch(NullPointerException e){temp[12]="FALSE";}
				try{temp[13] = row.get("Order2").toString();}catch(NullPointerException e){temp[13]="";}
				try{temp[14] = row.get("Order2Pay").toString();}catch(NullPointerException e){temp[14]="FALSE";}
				
				students.add(new Student(temp[0],temp[1],temp[2],temp[3],temp[4],temp[5],temp[6],temp[7],temp[8],
											temp[9],temp[10],temp[11],temp[12],temp[13],temp[14]));
			}
			Collections.sort(students, new StudentReferenceSortComparator());
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error somewhere loading student data.");return false;}
		return true;
	}
	
	public ArrayList<Senior> getSeniors()
	{
		ArrayList<Senior> seniors = new ArrayList<Senior>();
		UniqueCodeGenerator generator = new UniqueCodeGenerator();
		
		for(Student s:students)
		{
			if(s.grade.equals("12"))
			{
				seniors.add(new Senior(s.ref, s.first, s.last, s.ID, s.homeroom,"","{}",generator.generateUniqueCode()));
			}
		}
		
		return seniors;
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
				listTable = db.getTable("Lists");
			}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Student database!: "+e);return;}
		}
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
	public void addBlank(int blankNum)
	{
		try
		{
			long lastRef = Long.parseLong(students.get(students.size()-1).ref);
			for(int i=0;i<blankNum;i++)
			{
				table.addRow(lastRef+1+i+"","","","","","","",false,"","","","",false,"",false);
				students.add(new Student(lastRef+1+i+""));
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Adding Blank: "+e);}

	}
	public boolean addStudents(ArrayList<Student> addStudents)
	{
		try
		{
			long lastRef = Long.parseLong(students.get(students.size()-1).ref);
			Student temp;
			for(int i=0;i<addStudents.size();i++)
			{
				temp = addStudents.get(i);
				temp.ref = lastRef+1+i+"";
				addStudent(temp);
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Adding Blank: "+e);return false;}
		
		
		return true;
	}
	private void addStudent(Student s) throws NumberFormatException, IOException
	{
		table.addRow(s.ref,s.first,s.last,s.ID,s.grade,s.homeroom,s.track,s.photo,
				s.field1,s.field2,s.notes,s.order1,s.order1Pay,s.order2,s.order2Pay);
		students.add(s);
	}
	public void updateStudents(ArrayList<Student> update)
	{
		for(Student s:update)
		{
			saveStudent(s);
		}
	}
	public boolean updateOnlineOrder(String ref, String notes, String order)
	{
		if(search(ref))
		{
			if(!current.order2.equals("")) return false;
			else
			{
				if(order.contains("Gif")) gifOrder(order);
				current.order2 = order;
				current.order2Pay = "true";
				if(current.notes.equals("")) current.notes = notes;
				else current.notes+="\n"+notes;
				return saveStudent(current);
			}

		}
		return false;
	}
	private void gifOrder(String order)
	{
		try {
			FileUtils.copyFile(new File("JOBS\\"+job.location+"\\"+job.job+"\\CroppedLarge\\"+current.ref+".JPG"), new File("Gif\\"+current.ref+".JPG"));
			for(int i=0;i<15;i++)
			{
				if(order.contains("Gif"+i))
				{
					PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter("Gif\\Gif"+i+".txt",true)));
					out.println(current.ref+".JPG\t"+current.first+"\t"+current.last);
					out.close();
				}
			}
		} catch (IOException e) {
			JOptionPane.showMessageDialog(null, "Error Gif Order: "+e);
			e.printStackTrace();
		}
		
	}
	public boolean saveStudent(Student s)
	{
		try
		{
			if(!students.contains(s))
			{
				table.addRow((Long.parseLong(students.get(students.size()-1).ref)+1)+"",
						s.first,s.last,s.ID,s.grade,s.homeroom,s.track,s.photo,
						s.field1,s.field2,s.notes,s.order1,s.order1Pay,s.order2,s.order2Pay);
				students.add(s);
				return true;
			}
			else
			{
				IndexCursor cursor = CursorBuilder.createCursor(table.getPrimaryKeyIndex());
				boolean found = cursor.findFirstRow(Collections.singletonMap("RefNum", Long.parseLong(s.ref)));
				if(found)
				{
					cursor.updateCurrentRow(s.ref,s.first,s.last,s.ID,s.grade,s.homeroom,s.track,s.photo,
							s.field1,s.field2,s.notes,s.order1,s.order1Pay,s.order2,s.order2Pay);
					for(Student stu:students)
					{
						if(stu.equals(s))
						{
							stu = s;
							return true;
						}
					}
				}
			}
		}catch(Exception err){JOptionPane.showMessageDialog(null, "Fail!  Unable to add/save missing Student: "+err);}
		return false;
	}
	public void markPhotographed(ArrayList<String> names)
	{
		for(String n:names)
		{
			for(Student s:students)
			{
				if(n.equals(s.ref))
				{
					s.photo="true";
					try{
						IndexCursor cursor = CursorBuilder.createCursor(table.getPrimaryKeyIndex());
						boolean found = cursor.findFirstRow(Collections.singletonMap("RefNum", Long.parseLong(n)));
						if(found)
						{
							cursor.updateCurrentRow(s.ref,s.first,s.last,s.ID,s.grade,s.homeroom,s.track,s.photo,
									s.field1,s.field2,s.notes,s.order1,s.order1Pay,s.order2,s.order2Pay);
						}
					}catch(Exception e){}
					
				}
			}
			
		}
	}
	public ArrayList<Student> getStudents() {return new ArrayList<Student>(students);}
	public Student setCurrentStudent(String ref)
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
