package photo.software.comparators;

import java.util.Comparator;

import photo.software.event.EventStudent;

public class EventImageNumberSortComparator implements Comparator<EventStudent>{
	public int compare(EventStudent arg0, EventStudent arg1)
	{ 
		if(arg0.image.compareTo(arg1.image)==0)
		{
			return arg0.ref.compareTo(arg1.ref);
		}
		return arg0.image.compareTo(arg1.image);
	}
}
