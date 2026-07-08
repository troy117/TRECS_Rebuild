package photo.software.comparators;

import java.util.Comparator;

import photo.software.orders.plans.PackagePlan;



public class PackageSortComparator implements Comparator<PackagePlan>
{
	public int compare(PackagePlan o1, PackagePlan o2) {
		
		if(o1.plan.compareTo(o2.plan)==0)
		{
			return o1.code.compareTo(o2.code);
		}
		return o1.plan.compareTo(o2.plan);
		
	}
}

