package photo.software.comparators;

import java.util.Comparator;

import photo.software.senior.Senior;

public class SeniorReferenceSortComparator implements Comparator<Senior>{
	public int compare(Senior arg0, Senior arg1) {
		return arg0.ref.compareTo(arg1.ref);
	}

}
