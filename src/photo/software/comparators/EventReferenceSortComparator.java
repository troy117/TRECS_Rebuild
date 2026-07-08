package photo.software.comparators;

import java.util.Comparator;

import photo.software.event.EventStudent;

public class EventReferenceSortComparator implements Comparator<EventStudent>{
	public int compare(EventStudent arg0, EventStudent arg1){ return arg0.ref.compareTo(arg1.ref);}
}
