package photo.software.student.lists;

import java.util.ArrayList;

import photo.software.student.Student;


public class ListMaker 
{
	
	private ArrayList<Student> students;
	
	
	public ListMaker(ArrayList<Student> students)
	{
		this.students=students;
		
	}
	public String[][] toTableArray()
	{
		String[][] information = new String[students.size()][6];
		for(int i=0;i<students.size();i++)
		{
			information[i][0] = students.get(i).ref;
			information[i][1] = students.get(i).last;
			information[i][2] = students.get(i).first;
			information[i][3] = students.get(i).grade;
			information[i][4] = students.get(i).ID;
			information[i][5] = students.get(i).homeroom;
		}
		return information;
	}
}
