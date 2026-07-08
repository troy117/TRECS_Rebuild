package photo.software.comparators;

import java.util.Comparator;

import photo.software.event.EventStudent;

public class EventHomeroomSortComparator  implements Comparator<EventStudent>{
	public int compare(EventStudent arg0, EventStudent arg1)
	{
		if(arg0.homeroom.compareTo(arg1.homeroom)==0)
		{
			if(arg0.last.compareTo(arg1.last)==0)
			{
				if(arg0.first.compareTo(arg1.first)==0)	{ return arg0.ref.compareTo(arg1.ref);}
				return arg0.first.compareTo(arg1.first);
			}
			return arg0.last.compareTo(arg1.last);
		}
		return arg0.homeroom.compareTo(arg1.homeroom);
	}
}
