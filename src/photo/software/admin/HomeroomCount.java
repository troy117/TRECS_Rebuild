package photo.software.admin;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JOptionPane;

import photo.software.comparators.StudentClassSortComparator;
import photo.software.composites.Homeroom;
import photo.software.student.Student;

public class HomeroomCount 
{
	private ArrayList<Homeroom> homerooms = new ArrayList<Homeroom>();
	private String outputPath, schoolName;
	public HomeroomCount(ArrayList<Student> students, String schoolName, String outputPath)
	{
		this.schoolName = schoolName;
		this.outputPath = outputPath;
		Collections.sort(students, new StudentClassSortComparator());
		for(Student s:students)
		{
			if((!s.homeroom.equals(""))
					&&(!s.last.equals(""))
					&&(!s.first.equals(""))
					&&(!s.grade.equals("EXMPT"))) addToHomeroom(s);
		}
		printCount();		
	}
	private void addToHomeroom(Student s)
	{
		Boolean exists = false;
		for(Homeroom h: homerooms)
		{
			if(h.getHomeroom().equals(s.homeroom))
			{
				exists = true;
				h.addStudent(s);
				return;
			}
		}if(!exists)
		{
			homerooms.add(new Homeroom(s.homeroom));
			for(Homeroom h:homerooms)
			{
				if(h.getHomeroom().equals(s.homeroom)) h.addStudent(s);
			}
		}
	}
	private void printCount()
	{
		String totals = "Name,Size,Grade\n";
		for(Homeroom h:homerooms)
		{
			totals+=schoolName+","+h.getHomeroom()+","+h.totalStudents()+","+h.getGrades()+"\n";
		}
		PrintWriter out;
		try 
		{
			out = new PrintWriter(new BufferedWriter(new FileWriter(outputPath+"\\HomeroomTotals.txt",true)));
			out.println(totals);
			out.close();
		} catch (IOException e) {JOptionPane.showMessageDialog(null, "Error Printing Count: "+e);		}
	}
}
