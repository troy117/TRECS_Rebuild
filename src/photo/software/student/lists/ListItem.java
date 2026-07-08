package photo.software.student.lists;

import photo.software.student.Student;


public class ListItem 
{
	private String list;
	private Student student;
	public ListItem(String list, Student student)
	{
		this.list=list;
		this.student=student;
	}
	public String getList()
	{
		return list;
	}
	public Student getStudent()
	{
		return student;
	}
	
}
