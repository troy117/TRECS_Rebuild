package photo.software.composites;

import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JOptionPane;

import org.apache.commons.lang.WordUtils;

import photo.software.comparators.StudentClassFACSortComparator;
import photo.software.comparators.StudentLastNameSortComparator;
import photo.software.student.Student;

public class Homeroom 
{
	private String homeroom;
	private ArrayList<Student> students;
	private ArrayList<Student> teachers;
	private ArrayList<String> grades;
	String teacher = "";
	String temp="";
	public Homeroom(String homeroom)
	{
		this.homeroom=homeroom;
		students = new ArrayList<Student>();
		teachers = new ArrayList<Student>();
	}
	public Homeroom(String homeroom, ArrayList<Student> students)
	{
		this.homeroom=homeroom;
		this.students=students;
		teachers=new ArrayList<Student>();
		seperateTeachers();
	}
	public void addStudent(Student s)
	{
		if(s.grade.equals("FAC"))
		{
			if(!teachers.contains(s))
				teachers.add(s);
		}
		else if(!students.contains(s)) students.add(s);
	}
	public String getHomeroom()
	{
		return homeroom;
	}
	public ArrayList<Student> getStudentsAndStaff()
	{
		ArrayList<Student> all = new ArrayList<Student>();
		all.addAll(students);
		all.addAll(teachers);
		Collections.sort(all, new StudentClassFACSortComparator());
		return all;
	}
	public ArrayList<Student> getStudents()
	{
		return students;
	}
	public int totalStudents()
	{
		return students.size();
	}
	public int totalSize()
	{
		return students.size()+teachers.size();
	}
	public String getGrade()
	{
		String grade="";
		grades = new ArrayList<String>();
		for(Student s:students)
		{
			if(!grades.contains(s.grade)) grades.add(s.grade);
		}
		if(grades.size()==1)
		{
			if(grades.get(0).equals("KIN")) grade =  "Kindergarten";
			else if(grades.get(0).equals("PRE")) grade =  "Preschool";
			else if(grades.get(0).equals("TK")) grade =  "Transitional Kindergarten";
			else if(grades.get(0).equals("01")) grade =  "1st Grade";
			else if(grades.get(0).equals("02")) grade =  "2nd Grade";
			else if(grades.get(0).equals("03")) grade =  "3rd Grade";
			else if(grades.get(0).equals("04")) grade =  "4th Grade";
			else if(grades.get(0).equals("05")) grade =  "5th Grade";
			else if(grades.get(0).equals("06")) grade =  "6th Grade";
			else if(grades.get(0).equals("07")) grade =  "7th Grade";
			else if(grades.get(0).equals("08")) grade =  "8th Grade";
			else if(grades.get(0).equals("09")) grade =  "9th Grade";
			else if(grades.get(0).equals("10")) grade =  "10th Grade";
			else if(grades.get(0).equals("11")) grade =  "11th Grade";
			else if(grades.get(0).equals("12")) grade =  "12th Grade";
		}
		else
		{
			String temp = "How would you like to label the homeroom for "+homeroom+"\n with Grades: ";
			for(String s:grades) temp+=s+", ";
			temp.substring(0, temp.length()-1);
			grade = JOptionPane.showInputDialog(null, temp);
		}
		
		
		return grade;
	}
	public String getGrades()
	{
		String grade="";
		ArrayList<String> grades = new ArrayList<String>();
		for(Student s:students)
		{
			if(!grades.contains(s.grade)) grades.add(s.grade);
		}
		for(String g:grades) grade+=g+",";
		
		return grade;
	}
	public String getCSVGrades()
	{
		String grade="";
		ArrayList<String> grades = new ArrayList<String>();
		for(Student s:students)
		{
			if(!grades.contains(s.grade)) grades.add(s.grade);
		}
		for(String g:grades) grade+=g+"&";
		if(grade.endsWith("&")) grade = grade.substring(0,grade.length()-1);
		return grade;
	}
	public ArrayList<Student> getPhotographedStudents()
	{
		ArrayList<Student> stu = new ArrayList<Student>();
		for(Student s:students) if(s.photo.equals("true")) stu.add(s);
		return stu;
	}
	public void sortTeachers()
	{
		Collections.sort(teachers, new StudentLastNameSortComparator());
	}
	public String getTeacher()
	{
		temp="";
		for(Student s:teachers)
		{
			temp+=s.first+" "+s.last+"; ";
		}
		for(Student s:teachers)
		{
			if((s.first+" "+s.last).toUpperCase().contains(s.homeroom))
			{
				teacher = s.first+" "+s.last;
				teacher = WordUtils.capitalizeFully(teacher);
				teacher+=", Teacher";
				//Used to end homeroom with 's class
				//if(teacher.endsWith("s")) teacher+="' Class";
				//else teacher +="'s Class";
				break;
			}
		}
		if(teacher.equals(""))
		{
			teacher = JOptionPane.showInputDialog(null, "Teacher Header for "+homeroom+"? "+temp+": ");
		}
		else teacher = JOptionPane.showInputDialog(null,"What is the correct header for "+homeroom+":\n"+temp+": ",teacher);

		return teacher;
	}
	public String getTeacherCertificate()
	{
		temp="";
		for(Student s:teachers)
		{
			temp+=s.first+" "+s.last;
		}
		for(Student s:teachers)
		{
			if((s.first+" "+s.last).toUpperCase().contains(s.homeroom))
			{
				teacher = s.first+" "+s.last;
				teacher = WordUtils.capitalizeFully(teacher);
				break;
			}
		}
		return teacher;
	}
	public ArrayList<Student> getTeachers()
	{
		return teachers;
	}
	private void seperateTeachers()
	{
		for(Student s:students)
		{
			if(s.grade.equals("FAC"))
			{
				teachers.add(s);
				students.remove(s);
			}
		}
	}
}