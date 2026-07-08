package photo.software.comparators;

import java.util.Comparator;

import photo.software.spring.SpringStudent;

public class SpringStudentSortComparator implements Comparator<SpringStudent>
{
	public int compare(SpringStudent o1, SpringStudent o2) {
		if(o1.last.compareTo(o2.last)==0) return o1.first.compareTo(o2.first);
		return o1.last.compareTo(o2.last);
	}
}
