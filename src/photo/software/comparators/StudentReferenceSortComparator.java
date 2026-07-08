package photo.software.comparators;

import java.util.Comparator;

import photo.software.student.Student;

public class StudentReferenceSortComparator implements Comparator<Student>{
	public int compare(Student arg0, Student arg1) {
		return arg0.ref.compareTo(arg1.ref);
	}

}
