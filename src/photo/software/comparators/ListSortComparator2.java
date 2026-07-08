package photo.software.comparators;

import java.util.Comparator;

import photo.software.senior.lists.ListItem;



public class ListSortComparator2 implements Comparator<ListItem>
{
	public int compare(ListItem o1, ListItem o2) 
	{
		if(o1.getList().compareTo(o2.getList())==0)
		{
			return o1.getSenior().ref.compareTo(o2.getSenior().ref);
		}
		return o1.getList().compareTo(o2.getList());

		
	}
}
