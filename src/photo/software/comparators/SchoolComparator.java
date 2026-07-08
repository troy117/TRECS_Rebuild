package photo.software.comparators;

import java.util.Comparator;

import photo.software.login.SchoolData;

public class SchoolComparator implements Comparator<SchoolData>{
	public int compare(SchoolData arg0, SchoolData arg1) {
		return arg0.trecsName.compareTo(arg1.trecsName);
	}
}
