package photo.software.login;

public class JobData 
{
	public String id, refNum, location, job, type, plan, stuID, facID, notes;
	public JobData(String[] array)
	{
		this.id = array[0];
		this.refNum = array[1];
		this.location = array[2];
		this.job = array[3];
		this.type = array[4];
		this.plan = array[5];
		this.stuID = array[6];
		this.facID = array[7];
		this.notes = array[8];

	}
	public JobData(String id, String refNum, String location, String job, String type, String plan, String stuID, String facID, String notes)
	{
		this.id = id;
		this.refNum = refNum;
		this.location = location;
		this.job = job;
		this.type = type;
		this.plan = plan;
		this.stuID = stuID;
		this.facID = facID;
		this.notes = notes;
	}
	public boolean equals(Object o)
	{
		if(o != null && o instanceof JobData)
		{
			if(this.location.equals(((JobData)o).location)
					&&this.job.equals(((JobData)o).job)) return true;
			else if(this.id.equals(((JobData)o).id)) return true;
		}
		return false;
	}
	public String toString()
	{
		return id+": "+refNum+": "+location+": "+job;
	}
	public boolean isSports()
	{
		return type.equals("SPORTS");
	}
	public boolean isSpring()
	{
		return type.equals("SPRING");
	}
}
