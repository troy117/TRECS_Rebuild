package photo.software.login;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

import photo.software.QRevent.CreateQREventDatabase;
import photo.software.comparators.JobDataComparator;
import photo.software.comparators.SchoolComparator;
import photo.software.event.CreateEventDatabase;
import photo.software.league.CreateLeagueDatabase;
import photo.software.orders.plans.PackagePlan;
import photo.software.senior.CreateSeniorDatabase;
import photo.software.senior.Senior;
import photo.software.spring.CreateSpringStudentDatabase;
import photo.software.student.CreateStudentDatabase;
import photo.software.student.Students;

import com.healthmarketscience.jackcess.Cursor;
import com.healthmarketscience.jackcess.CursorBuilder;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.Row;
import com.healthmarketscience.jackcess.Table;

public class ProgramData
{
	private Database db;
	private Table table,plans;
	private ArrayList<JobData> jobs;
	private ArrayList<SchoolData> schools;
	private ArrayList<PackagePlan> pPlans;
	private ArrayList<String> IDtemplates;
	private File dataFile;
	private DesktopWindow window;
	public ProgramData(DesktopWindow window)
	{
		this.window = window;
		dataFile = new File("ProgramData.accdb");
	}
	public ProgramData(String programData,DesktopWindow window)
	{
		this.window = window;
		dataFile = new File(programData);
	}
	public void openJobs()
	{
		try 
		{
			jobs = new ArrayList<JobData>();
			db = DatabaseBuilder.open(dataFile);
			table = db.getTable("Jobs");
			String[] temp = new String[9];
			for(Row row:table)
			{
				try{temp[0] = row.get("ID").toString();}catch(NullPointerException e){temp[0]="";}
				try{temp[1] = row.get("ReferenceNumber").toString();}catch(NullPointerException e){temp[1]="";}
				try{temp[2] = row.get("Location").toString();}catch(NullPointerException e){temp[2]="";}
				try{temp[3] = row.get("JobName").toString();}catch(NullPointerException e){temp[3]="";}
				try{temp[4] = row.get("Type").toString();}catch(NullPointerException e){temp[4]="";}
				try{temp[5] = row.get("PackagePlan").toString();}catch(NullPointerException e){temp[5]="";}
				try{temp[6] = row.get("STU_ID").toString();}catch(NullPointerException e){temp[6]="";}
				try{temp[7] = row.get("FAC_ID").toString();}catch(NullPointerException e){temp[7]="";}
				try{temp[8] = row.get("Notes").toString();}catch(NullPointerException e){temp[8]="";}
				
				try{jobs.add(new JobData(temp));}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Adding New JobData: "+e);}
			}
			Collections.sort(jobs, new JobDataComparator());
			
			schools = new ArrayList<SchoolData>();
			table = db.getTable("Schools");
			temp = new String[18];
			for(Row row:table)
			{
				try{temp[0] = row.getString("ReferenceNumber").toString();}catch(NullPointerException e){temp[0]="";}
				try{temp[1] = row.getString("SchoolName").toString();}catch(NullPointerException e){temp[1]="";}
				try{temp[2] = row.getString("TrecsName").toString();}catch(NullPointerException e){temp[2]="";}
				try{temp[3] = row.getString("Phone").toString();}catch(NullPointerException e){temp[3]="";}
				try{temp[4] = row.getString("Address").toString();}catch(NullPointerException e){temp[4]="";}
				try{temp[5] = row.getString("City").toString();}catch(NullPointerException e){temp[5]="";}
				try{temp[6] = row.getString("State").toString();}catch(NullPointerException e){temp[6]="";}
				try{temp[7] = row.getString("Zipcode").toString();}catch(NullPointerException e){temp[7]="";}
				try{temp[8] = row.getString("Contact1Name").toString();}catch(NullPointerException e){temp[8]="";}
				try{temp[9] = row.getString("Contact1Position").toString();}catch(NullPointerException e){temp[9]="";}
				try{temp[10] = row.getString("Contact1Email").toString();}catch(NullPointerException e){temp[10]="";}
				try{temp[11] = row.getString("Contact2Name").toString();}catch(NullPointerException e){temp[11]="";}
				try{temp[12] = row.getString("Contact2Position").toString();}catch(NullPointerException e){temp[12]="";}
				try{temp[13] = row.getString("Contact2Email").toString();}catch(NullPointerException e){temp[13]="";}
				try{temp[14] = row.getString("Contact3Name").toString();}catch(NullPointerException e){temp[14]="";}
				try{temp[15] = row.getString("Contact3Position").toString();}catch(NullPointerException e){temp[15]="";}
				try{temp[16] = row.getString("Contact3Email").toString();}catch(NullPointerException e){temp[16]="";}
				try{temp[17] = row.getString("Notes").toString();}catch(NullPointerException e){temp[17]="";}
				try{schools.add(new SchoolData(temp[0],temp[1],temp[2],temp[3],temp[4],temp[5],temp[6],temp[7],temp[8],temp[9],
						temp[10],temp[11],temp[12],temp[13],temp[14],temp[15],temp[16],temp[17]));}
				catch(Exception e){JOptionPane.showMessageDialog(null, "Error Adding New SchoolData: "+e);}
			}
			Collections.sort(schools, new SchoolComparator());
			String IDtemp;
			IDtemplates = new ArrayList<String>();
			IDtemplates.add("");
			table = db.getTable("IDtemplate");
			for(Row row:table)
			{
				try{IDtemp = row.getString("Plan").toString();
				if(!IDtemplates.contains(IDtemp)) IDtemplates.add(IDtemp);
				}catch(NullPointerException e){}}
			close();

		}
		catch(Exception e) 
		{
			JOptionPane.showMessageDialog(null, "Error within ProgramData/openJob");
		}
	}
	public SchoolData getSchoolData(String trecsName)
	{
		for(SchoolData s:schools)
		{
			if(s.trecsName.equals(trecsName)) return s;
		}
		return new SchoolData("",trecsName);
	}
	public ArrayList<String> getIDtemplates()
	{
		Collections.sort(IDtemplates);
		return IDtemplates;
	}
	public ArrayList<SchoolData> getSchools()
	{
		return new ArrayList<SchoolData>(schools);
	}
	public boolean saveJob(JobData saveJob)
	{
		try
		{
			db = DatabaseBuilder.open(dataFile);
			table = db.getTable("Jobs");
			Cursor cursor = CursorBuilder.createCursor(table);
			if(cursor.findFirstRow(table.getColumn("ID"), saveJob.id))
			{
				cursor.updateCurrentRow(saveJob.id,saveJob.refNum,saveJob.location,saveJob.job,saveJob.type,saveJob.plan,saveJob.stuID,saveJob.facID,saveJob.notes);
				for(JobData j:jobs)
				{
					if(j.id.equals(saveJob.id))
					{
						j=saveJob;
						break;
					}
				}
			}
			else return false;
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Failed to save Job Notes :-(");return false;}
		return true;
	}
	private boolean addSchoolToDatabase(SchoolData addSchool)
	{
		try
		{
			db = DatabaseBuilder.open(dataFile);
			table = db.getTable("Schools");
			table.addRow(addSchool.refNum, addSchool.schoolName, addSchool.trecsName,
					addSchool.phone, addSchool.address, addSchool.city,	addSchool.state, addSchool.zipcode,
					addSchool.c1Name, addSchool.c1Position, addSchool.c1Email,
					addSchool.c2Name, addSchool.c2Position, addSchool.c3Email,
					addSchool.c3Name, addSchool.c3Position, addSchool.c3Email,
					addSchool.notes);
			schools.add(addSchool);
			close();
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Fail to add new School to Database");return false;}
		return true;
	}
	/* THIS IS FOR THE ONSITE SETUPS. DON'T NEED TO TRANSFER ALL SCHOOL DATA.*/
	public boolean addSchool(String reference, String name)
	{
		return addSchool(new SchoolData(reference,name));
	}
	public boolean addSchool(SchoolData addSchool)
	{
		if(addSchool.refNum.equals(""))
		{
			for(SchoolData school:schools)
			{	
				if(school.trecsName.equals(addSchool.trecsName))
				{
					return false;
				}
			}
			addSchool.refNum = ((schools.size()+1)*10000)+"";
			return addSchoolToDatabase(addSchool);
		}
		else
		{
			for(SchoolData school:schools)
			{
				if(school.trecsName.equals(addSchool.trecsName))
				{
					return false;
				}				
				else if(school.refNum.equals(addSchool.refNum))
				{
					return false;
				}
			}
			return addSchoolToDatabase(addSchool);
		}
	}
	public String getTrecsSchoolRef(String school)
	{
		for(SchoolData data:schools) if(data.trecsName.equals(school)) return data.refNum;
		JOptionPane.showMessageDialog(null, "Unable to find Reference Number for School: "+school);
		return null;
	}
	public boolean addJob(JobData addJob)
	{
		if(jobs.contains(addJob))
		{
			JOptionPane.showMessageDialog(null, "Program already contains this job.");
			return false;
		}
		try
		{
			db = DatabaseBuilder.open(dataFile);
			table = db.getTable("Jobs");
			table.addRow(addJob.id,addJob.refNum,addJob.location,addJob.job,addJob.type,addJob.plan,addJob.stuID,addJob.facID,addJob.notes);
			
			close();
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Fail to add new Job");return false;}
		if(addJob.type.equals("FALL")) fallSetup(addJob);
		else if(addJob.type.equals("SPORTS")) sportSetup(addJob);
		else if(addJob.type.equals("EVENT")) eventSetup(addJob);
		else if(addJob.type.equals("QREVENT")) qrEventSetup(addJob);
		else if(addJob.type.equals("LEAGUE")) leagueSetup(addJob);
		else if(addJob.type.equals("SPRING")) springSetup(addJob);
		else if(addJob.type.equals("SENIORS")) seniorSetup(addJob);
		
		Collections.sort(jobs, new JobDataComparator());
		return true;	
	}
	private void springSetup(JobData addJob)
	{

		JFileChooser fc = new JFileChooser(new File(window.jobs+"\\"+addJob.location));
		fc.setDialogTitle("Select Fall Job Folder");
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showOpenDialog(null);
		if(returnVal == JFileChooser.APPROVE_OPTION)
		{
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\CroppedLarge").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\CroppedMed").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Processed").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Notes").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Borders").mkdirs();
			new CreateSpringStudentDatabase(addJob.refNum,addJob.location, 
					window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database",window.jobs+"\\"+addJob.location+"\\"+fc.getSelectedFile().getName());
			jobs.add(addJob);
		}
	}
	private void fallSetup(JobData addJob)
	{
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\CroppedLarge").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\CroppedMed").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\CroppedSmall").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Templates").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Borders").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Certificates").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Processed").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Exports").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Notes").mkdirs();
		new CreateStudentDatabase(addJob.refNum,addJob.location, window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database");
		jobs.add(addJob);
	}
	private void seniorSetup(JobData addJob)
	{
		
		JFileChooser fc = new JFileChooser(new File(window.jobs+"\\"+addJob.location));
		fc.setDialogTitle("Select Fall Job Folder");
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showOpenDialog(null);
		if(returnVal == JFileChooser.APPROVE_OPTION)
		{
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Images").mkdirs();
			
			
			File fallData = new File(fc.getSelectedFile().getAbsolutePath()+"\\Database\\Students.accdb");
			Students fallStudents = new Students(fallData);
			fallStudents.openStudentDatabase();
			ArrayList<Senior> seniors = fallStudents.getSeniors();
			new CreateSeniorDatabase(addJob.refNum,addJob.location, window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database",seniors,fc.getSelectedFile().getAbsolutePath());
			fallStudents.close();
			
			jobs.add(addJob);
		}
	}
	
	private void sportSetup(JobData addJob)
	{
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\CroppedLargeWithBorder").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\CroppedLarge").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\CroppedMed").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\CroppedSmall").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Templates").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Processed").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Notes").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\MemoryMateTemplates").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Group8x10").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Group11x14").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\GroupOriginal").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\CustomAddOns").mkdirs();
		new CreateStudentDatabase(addJob.refNum,addJob.location, window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database");
		jobs.add(addJob);
	}
	private void qrEventSetup(JobData addJob)
	{
		JFileChooser fc = new JFileChooser(new File(window.jobs+"\\"+addJob.location));
		fc.setDialogTitle("Select Fall Job Folder");
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showOpenDialog(null);
		if(returnVal == JFileChooser.APPROVE_OPTION)
		{
			String input = JOptionPane.showInputDialog("Website Prefix", "http://download.islandphotography.net/");
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Images").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Templates").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Processed").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Notes").mkdirs();
			new CreateQREventDatabase(addJob.refNum,addJob.location, 
					window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database",
					window.jobs+"\\"+addJob.location+"\\"+fc.getSelectedFile().getName(),input);
			jobs.add(addJob);
		}
	}
	
	private void eventSetup(JobData addJob)
	{
		JFileChooser fc = new JFileChooser(new File(window.jobs+"\\"+addJob.location));
		fc.setDialogTitle("Select Fall Job Folder");
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showOpenDialog(null);
		if(returnVal == JFileChooser.APPROVE_OPTION)
		{
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Images").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Templates").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Processed").mkdirs();
			new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Notes").mkdirs();
			new CreateEventDatabase(addJob.refNum,addJob.location, 
					window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database",
					window.jobs+"\\"+addJob.location+"\\"+fc.getSelectedFile().getName());
			jobs.add(addJob);
		}
	}
	private void leagueSetup(JobData addJob)
	{
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Images").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Templates").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Processed").mkdirs();
		new File(window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Notes").mkdirs();
		new CreateLeagueDatabase(addJob.refNum,addJob.location, window.jobs+"\\"+addJob.location+"\\"+addJob.job+"\\Database");
		jobs.add(addJob);
	}
	public int totalJobs()
	{
		return jobs.size();
	}
	public ArrayList<JobData> getJobs()
	{
		return jobs;
	}
	
	/////////////////////Package Plans/////////////////////////
	public void openPackagePlans()
	{
		pPlans = new ArrayList<PackagePlan>();
		try
		{
			db = DatabaseBuilder.open(dataFile);
			plans = db.getTable("PackagePlans");
			String[] temp = new String[18];
			int i=0;
			for(Row row:plans)
			{
				try
				{
					try{temp[0] = row.get("PackagePlan").toString();}catch(NullPointerException e){temp[0]="";}
					try{temp[1] = row.get("Code").toString();}catch(NullPointerException e){temp[1]="";}
					try{temp[2] = row.get("CodeName").toString();}catch(NullPointerException e){temp[2]="";}
					try{temp[3] = row.get("f1").toString();}catch(NullPointerException e){temp[3]="";}
					try{temp[4] = row.get("f2").toString();}catch(NullPointerException e){temp[4]="";}
					try{temp[5] = row.get("f3").toString();}catch(NullPointerException e){temp[5]="";}
					try{temp[6] = row.get("f4").toString();}catch(NullPointerException e){temp[6]="";}
					try{temp[7] = row.get("f5").toString();}catch(NullPointerException e){temp[7]="";}
					try{temp[8] = row.get("f6").toString();}catch(NullPointerException e){temp[8]="";}
					try{temp[9] = row.get("f7").toString();}catch(NullPointerException e){temp[9]="";}
					try{temp[10] = row.get("f8").toString();}catch(NullPointerException e){temp[10]="";}
					try{temp[11] = row.get("f9").toString();}catch(NullPointerException e){temp[11]="";}
					try{temp[12] = row.get("f10").toString();}catch(NullPointerException e){temp[12]="";}
					try{temp[13] = row.get("f11").toString();}catch(NullPointerException e){temp[13]="";}
					try{temp[14] = row.get("f12").toString();}catch(NullPointerException e){temp[14]="";}
					try{temp[15] = row.get("f13").toString();}catch(NullPointerException e){temp[15]="";}
					try{temp[16] = row.get("f14").toString();}catch(NullPointerException e){temp[16]="";}
					try{temp[17] = row.get("f15").toString();}catch(NullPointerException e){temp[17]="";}
					pPlans.add(new PackagePlan(temp[0],temp[1],temp[2],temp[3],temp[4],temp[5],
												temp[6],temp[7],temp[8],temp[9],temp[10],temp[11],temp[12],temp[13],temp[14],temp[15],temp[16],temp[17]));
					i++;
				}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Package Plan row: "+i);}
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading openPackagePlans(): "+e);}
	}
	public ArrayList<PackagePlan> getPackagePlans(){return pPlans;}
	public void remove(PackagePlan p)
	{
		try
		{
			Map<String,Object> rowPattern = new HashMap<String,Object>();
			rowPattern.put("PackagePlan", p.plan);
			rowPattern.put("Code", p.code);
			Cursor curse = CursorBuilder.createCursor(plans);
			if(curse.findFirstRow(rowPattern)) curse.deleteCurrentRow();
			for(PackagePlan plan:pPlans)
			{
				if(plan.plan.equals(p.plan)&&plan.code.equals(p.code))
				{
					pPlans.remove(plan);
					break;
				}
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Removing Package: "+e);}
	}
	public void savePackagePlan(PackagePlan p)
	{
		try
		{
			Map<String,Object> rowPattern = new HashMap<String,Object>();
			rowPattern.put("PackagePlan", p.plan);
			rowPattern.put("Code", p.code);
			Cursor curse = CursorBuilder.createCursor(plans);
			curse.findFirstRow(rowPattern);
			curse.updateCurrentRow(p.plan,p.code,p.name,p.f[0],p.f[1],p.f[2],p.f[3],p.f[4],p.f[5],p.f[6],p.f[7],p.f[8],p.f[9],p.f[10],p.f[11],p.f[12],p.f[13],p.f[14]);
			for(PackagePlan plan:pPlans)
			{
				if(plan.plan.equals(p.plan)&&plan.code.equals(p.code))
				{
					plan = p;
					break;
				}
			}
			
		}catch(Exception e)
		{
			try
			{
				plans.addRow(p.plan,p.code,p.name,p.f[0],p.f[1],p.f[2],p.f[3],p.f[4],p.f[5],p.f[6],p.f[7],p.f[8],p.f[9],p.f[10],p.f[11],p.f[12],p.f[13],p.f[14]);
			}catch(Exception err){JOptionPane.showMessageDialog(null, "Error Saving PackagePlan: "+err);}
		}	
	}
	public void close()
	{
		try{db.close();}catch(Exception e){JOptionPane.showMessageDialog(null, "Close Error: "+e);}
	}
}
