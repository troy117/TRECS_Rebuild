package photo.software.comparators;

import java.util.Comparator;

import photo.software.spring.SpringStudent;

public class SpringReferenceSortComparator implements Comparator<SpringStudent>
{
	public int compare(SpringStudent arg0, SpringStudent arg1) {
		return arg0.ref.compareTo(arg1.ref);
	}
}
