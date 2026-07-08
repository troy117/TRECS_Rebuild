package photo.software.comparators;

import java.util.Comparator;

import photo.software.QRevent.QRstudent;

public class QREventImageNumberSortComparator implements Comparator<QRstudent>{
	public int compare(QRstudent arg0, QRstudent arg1)
	{ 
		if(arg0.image.compareTo(arg1.image)==0)
		{
			return arg0.ref.compareTo(arg1.ref);
		}
		return arg0.image.compareTo(arg1.image);
	}
}
