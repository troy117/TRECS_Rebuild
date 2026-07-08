package photo.software.onsite;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import javax.swing.JOptionPane;

import photo.software.login.JobData;


public class CreateOnsiteSetup 
{
	public CreateOnsiteSetup(String path, JobData job)
	{
		String timeStamp = new SimpleDateFormat("MM_dd").format(Calendar.getInstance().getTime());
		new File(path+"\\Fall_Onsite_Setup_"+job.location+"_"+job.job+"_"+timeStamp+"\\Database").mkdirs();
		new File(path+"\\Fall_Onsite_Setup_"+job.location+"_"+job.job+"_"+timeStamp+"\\CroppedMed").mkdirs();
		try
		{
			copyDirectory(new File(path+"\\CroppedMed"),new File(path+"\\Fall_Onsite_Setup_"+job.location+"_"+job.job+"_"+timeStamp+"\\CroppedMed"));
			
			Files.copy(new File(path+"\\Database\\Students.accdb").toPath(), 
					new File(path+"\\Fall_Onsite_Setup_"+job.location+"_"+job.job+"_"+timeStamp+"\\Database\\Students.accdb").toPath());
			
			String schoolInfo = path+"\\Fall_Onsite_Setup_"+job.location+"_"+job.job+"_"+timeStamp+"\\FALL_school.txt";
			PrintWriter out = new PrintWriter(schoolInfo,"UTF-8");
			out.print(job.id+", "+job.refNum+", "+job.location+", "+job.job+", "+job.type+", "+job.plan+", "+job.stuID+", "+job.facID+", "+job.notes);
			out.close();
			
			if(!new File(schoolInfo).exists()) JOptionPane.showMessageDialog(null, "UHOH... FALL_school.txt was not created...");
			else JOptionPane.showMessageDialog(null, "Complete!");
		}catch(Exception e){System.out.println("Error Creating Onsite Setup\n"+path+"\nError: "+e);}
	}
	private void copyDirectory(File inputFolder, File outputFolder) throws IOException
	{
		String[] children = inputFolder.list();
		for(int i=0;i<children.length;i++)
		{
			Files.copy(new File(inputFolder.getAbsoluteFile()+"\\"+children[i]).toPath(), 
					new File(outputFolder.getAbsoluteFile()+"\\"+children[i]).toPath(),StandardCopyOption.REPLACE_EXISTING);
		}
	}
}
