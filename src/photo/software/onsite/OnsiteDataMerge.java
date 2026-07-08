package photo.software.onsite;

import java.io.File;
import java.io.FilenameFilter;
import java.util.ArrayList;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

import photo.software.student.Student;
import photo.software.student.Students;

public class OnsiteDataMerge 
{
	private Students server, endOfDayStudents;
	private ArrayList<Student> endStudents;
	private File endOfDayFolder;
	private String ref;
	public OnsiteDataMerge(Students server,String schoolPath)
	{
		this.server = server;
		JFileChooser fc = new JFileChooser(schoolPath+"\\Processed");
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showDialog(null, "Open EndOfDay");
		if(returnVal == JFileChooser.APPROVE_OPTION)
		{
			if(fc.getSelectedFile().getName().contains("_END_OF_DAY_"))
			{
				endOfDayFolder = fc.getSelectedFile();
				loadEndOfDayDatabase(fc.getSelectedFile()+"\\Database\\Students.accdb");
				processChanges();
				createList();
			}
		}
	}
	private void loadEndOfDayDatabase(String database)
	{
		endOfDayStudents = new Students(database);
		endOfDayStudents.openStudentDatabase();
		endStudents= endOfDayStudents.getStudents();
		endOfDayStudents.close();
	}
	private void processChanges()
	{
		if(endStudents.size()>server.size()) 
			JOptionPane.showMessageDialog(null, "Photographers added "
					+(endStudents.size()-server.size())+" blank records."+ "\n No Changes Made.");
		else if(endStudents.size()<server.size()) JOptionPane.showMessageDialog(null, "Server students file has fewer students... No Changes Made.");
		else
		{
			for(int i=0;i<endStudents.size();i++)
			{
				if(endStudents.get(i).photo.equals("true"))	copyOverStudent(endStudents.get(i));
			}
		}
	}
	private void copyOverStudent(Student s)
	{
		if(s.first.equals("")&&s.last.equals("")) return;
		else if(server.getStudent(s.ref).noDiff(s)) server.saveStudent(s);
		else
		{
			int n = JOptionPane.showOptionDialog(null, "Do you want to make the following changes for "+s.ref+"?\n"+server.getStudent(s.ref).difference(s), 
					"Data Conflict", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null, null, JOptionPane.YES_OPTION);
			if(n==JOptionPane.YES_OPTION) server.saveStudent(s);
			else if(n==JOptionPane.NO_OPTION) {
				s = server.getStudent(s.ref);
				s.photo = "true";
				server.saveStudent(s);
			}
		}
	}
	private void createList()
	{
		int createList = JOptionPane.showConfirmDialog(null, "Would you like to create a list for the images photographed?");
		if(createList == JOptionPane.YES_OPTION)
		{
			String listName = JOptionPane.showInputDialog(null,"Input List Name",endOfDayFolder.getName().substring(0,5)+" List");
			String[] imgList = endOfDayFolder.list(new FilenameFilter(){
				public boolean accept(File dir, String name) 
				{
					if(name.toUpperCase().endsWith("JPG")) return true;
					return false;
				}
			});
			ArrayList<String> imgRef = new ArrayList<String>();
			for(String s:imgList)
			{
				ref = s.substring(s.indexOf("-")+1,s.indexOf("."));
				if(!imgRef.contains(ref))
				{
					imgRef.add(ref);
					server.addStudentToList(listName, ref, false);
				}
			}
		}
	}
}






































