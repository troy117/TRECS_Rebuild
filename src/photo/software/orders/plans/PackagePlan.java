package photo.software.orders.plans;

public class PackagePlan 
{
	public String plan, code, name;
	private int envelopeCount, bigEnvelopeCount, labelCount;
	public String[] f = new String[15];

	
	public PackagePlan(String plan, String code, String name, String field1, String field2, String field3,
			String field4, String field5, String field6, String field7, String field8, 
			String field9, String field10, String field11, String field12, String field13, String field14, String field15)
	{
		this.plan=plan;
		this.code=code;
		this.name=name;
		f[0]=field1;
		f[1]=field2;
		f[2]=field3;
		f[3]=field4;
		f[4]=field5;
		f[5]=field6;
		f[6]=field7;
		f[7]=field8;
		f[8]=field9;
		f[9]=field10;
		f[10]=field11;
		f[11]=field12;
		f[12]=field13;
		f[13]=field14;
		f[14]=field15;
	}
	public PackagePlan(String plan, String code)
	{
		this.plan = plan;
		this.code = code;
		this.name = "";
		f[0]="";
		f[1]="";
		f[2]="";
		f[3]="";
		f[4]="";
		f[5]="";
		f[6]="";
		f[7]="";
		f[8]="";
		f[9]="";
		f[10]="";
		f[11]="";
		f[12]="";
		f[13]="";
		f[14]="";
	}
	public PackagePlan(String plan, String code, String name)
	{
		this.plan = plan;
		this.code = code;
		this.name = name;
		f[0]="";
		f[1]="";
		f[2]="";
		f[3]="";
		f[4]="";
		f[5]="";
		f[6]="";
		f[7]="";
		f[8]="";
		f[9]="";
		f[10]="";
		f[11]="";
		f[12]="";
		f[13]="";
		f[14]="";
	}
	public PackagePlan(String plan, String code, String name,String f0)
	{
		this.plan = plan;
		this.code = code;
		this.name = name;
		f[0]=f0;
		f[1]="";
		f[2]="";
		f[3]="";
		f[4]="";
		f[5]="";
		f[6]="";
		f[7]="";
		f[8]="";
		f[9]="";
		f[10]="";
		f[11]="";
		f[12]="";
		f[13]="";
		f[14]="";
	}
	public String toString()
	{
		return new String(plan+": "+code+" "+name+": "+f[0]+" "+f[1]+" "+f[2]+" "+f[3]+" "+f[4]+" "+f[5]+" "+f[6]+" "+f[7]+" "+f[8]+" "+f[9]+" "+f[10]+" "+f[11]+" "+f[12]+" "+f[13]+" "+f[14]);
	}
	public String getContents1()
	{
		String s = "";
		for(int i=0;i<5;i++) if(!f[i].equals("")) s+=f[i]+", ";
		if(s.endsWith(", ")) s=s.substring(0, s.length()-2);
		return s;
	}
	public String getContents2()
	{
		String s = "";
		for(int i=5;i<10;i++) if(!f[i].equals("")) s+=f[i]+", ";
		if(s.endsWith(", ")) s=s.substring(0, s.length()-2);
		return s;
	}
	public String getContents3()
	{
		String s = "";
		for(int i=10;i<15;i++) if(!f[i].equals("")) s+=f[i]+", ";
		if(s.endsWith(", ")) s=s.substring(0, s.length()-2);
		return s;
	}
	public String getContents()
	{
		String s = "";
		for(int i=0;i<15;i++) if(!f[i].equals("")) s+=f[i]+", ";
		if(s.endsWith(", ")) s=s.substring(0, s.length()-2);
		return s;
	}
	public void updateCounts()
	{
		labelCount = 0;
		envelopeCount = 0;
		bigEnvelopeCount = 0;
		for(int i=0;i<15;i++)
		{
			if(f[i].contains("Mug")) labelCount++;
			else if(f[i].contains("Waterbottle")) labelCount++;
			else if(f[i].contains("Plaque")) labelCount++;
			else if(f[i].contains("10x13")) bigEnvelopeCount++;
			else if(f[i].contains("ArtPrint")) bigEnvelopeCount++;
			else if(!f[i].equals("")) envelopeCount++;
		}
	}
	public int getLabelItemCount()
	{
		return labelCount;
	}
	public int getEnvelopeCount()
	{
		return envelopeCount;
	}
	public int getBigEnvelopeCount()
	{
		return bigEnvelopeCount;
	}

}
