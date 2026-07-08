package photo.software.comparators;

import java.util.Comparator;

import photo.software.student.lists.ListItem;



public class ListSortComparator implements Comparator<ListItem>
{
	public int compare(ListItem o1, ListItem o2) 
	{
		if(o1.getList().compareTo(o2.getList())==0)
		{
			return o1.getStudent().ref.compareTo(o2.getStudent().ref);
		}
		return o1.getList().compareTo(o2.getList());

		
	}
}
