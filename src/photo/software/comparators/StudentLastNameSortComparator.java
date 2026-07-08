package photo.software.comparators;

import java.util.Comparator;

import photo.software.student.Student;



public class StudentLastNameSortComparator  implements Comparator<Student>
{
	public int compare(Student o1, Student o2) {	
		if(o1.last.compareTo(o2.last)==0) return o1.first.compareTo(o2.first);
		return o1.last.compareTo(o2.last);
	}
}
