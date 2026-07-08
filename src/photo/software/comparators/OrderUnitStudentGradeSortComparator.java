package photo.software.comparators;

import java.util.Comparator;

import photo.software.render.RenderOrder;
public class OrderUnitStudentGradeSortComparator implements Comparator<RenderOrder>
{
	public int compare(RenderOrder o1, RenderOrder o2) {
		
		if(o1.grade.compareTo(o2.grade)==0)
		{
			if(o1.last.compareTo(o2.last)==0) return o1.first.compareTo(o2.first);
			return o1.last.compareTo(o2.last);
		}
		return o1.grade.compareTo(o2.grade);
	}
}
