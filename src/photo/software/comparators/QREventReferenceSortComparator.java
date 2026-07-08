package photo.software.comparators;

import java.util.Comparator;

import photo.software.QRevent.QRstudent;


public class QREventReferenceSortComparator implements Comparator<QRstudent>{
	public int compare(QRstudent arg0, QRstudent arg1){ return arg0.ref.compareTo(arg1.ref);}
}
