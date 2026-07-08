package photo.software.comparators;

import java.util.Comparator;

import photo.software.student.Student;



public class StudentClassFACSortComparator implements Comparator<Student>
{
	public int compare(Student o1, Student o2) 
	{	
		if(o1.homeroom.compareTo(o2.homeroom)==0)
		{
			if(o1.grade.compareTo(o2.grade)==0)
			{
				if(o1.last.compareTo(o2.last)==0) return o1.first.compareTo(o2.first);
				return o1.last.compareTo(o2.last);
			}
			else
			{
				if(o1.grade.equals("FAC")) return -1;
				else if(o2.grade.equals("FAC")) return 1;
				if(o1.last.compareTo(o2.last)==0) return o1.first.compareTo(o2.first);
				return o1.last.compareTo(o2.last);
			}
		}
		return o1.homeroom.compareTo(o2.homeroom);
	}
}
