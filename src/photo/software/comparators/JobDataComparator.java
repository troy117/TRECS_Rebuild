package photo.software.comparators;

import java.util.Comparator;

import photo.software.login.JobData;

public class JobDataComparator implements Comparator<JobData> {

	@Override
	public int compare(JobData arg0, JobData arg1) 
	{
		if(arg0.location.compareTo(arg1.location)==0)
		{
			if(arg0.plan.compareTo(arg1.plan)==0)
			{
				return arg0.job.compareTo(arg1.job);
			}
			return arg0.plan.compareTo(arg1.plan);
		}
		return arg0.location.compareTo(arg1.location);
	}

}
