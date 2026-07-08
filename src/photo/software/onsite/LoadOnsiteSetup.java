package photo.software.onsite;

import java.io.File;
import java.io.FileReader;
import java.util.Scanner;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

import org.apache.commons.io.FileUtils;

import photo.software.login.ChooseSchoolGUI;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;

public class LoadOnsiteSetup 
{
	private File directory;
	private DesktopWindow window;
	private ChooseSchoolGUI gui;
	private File[] onSites;
	private String log = "";
	public LoadOnsiteSetup(DesktopWindow window, ChooseSchoolGUI gui)
	{
		this.window = window;
		this.gui = gui;
		JFileChooser fc = new JFileChooser();
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showDialog(null, "Choose Onsite Setups Folder");
		if(returnVal==JFileChooser.APPROVE_OPTION)
		{
			if(fc.getSelectedFile().isDirectory())
			{
				onSites=fc.getSelectedFile().listFiles();
				for(File f:onSites)
				{
					if(f.getName().contains("RAW"))
					{
						directory = fc.getSelectedFile();
						loadOnsite();
						return;
					}
				}
				for(File f:onSites)
				{
					directory = f;
					loadOnsite();
				}
			}
			JOptionPane.showMessageDialog(null, "Log:\n"+log);
		}
	}
	private void loadOnsite()
	{
		File school = new File(directory+"\\FALL_school.txt");
		if(!school.exists())
		{
			log += directory+": Invalid OnsiteSetup, missing FALL_school.txt\n";
			return;
		}
		try
		{
			
			FileReader reader = new FileReader(school);
			Scanner in = new Scanner(reader);
			in.useDelimiter(",");
			String id = in.next().trim();
			String ref = in.next().trim();
			String location = in.next().trim();
			String job = in.next().trim();
			String type = in.next().trim();
			String plan = in.next().trim();
			String stuID = in.next().trim();
			String facID = in.next().trim();
			String notes = in.next().trim();
			in.close();
			log += location + " school added: " + window.programData.addSchool(ref, location)+"\n";
			log += location + " job added: " + window.programData.addJob(new JobData(id,ref,location,job,type,plan,stuID,facID,notes))+"\n";
			
			File currentDB = new File(window.jobs+"\\"+location+"\\"+job+"\\Database\\Students.accdb");
			File backupDB = new File(window.jobs+"\\"+location+"\\"+job+"\\Database\\Backup_Students.accdb");
			if(backupDB.exists()) backupDB.delete();
			if(currentDB.exists()) currentDB.renameTo(backupDB);
			FileUtils.copyFile(new File(directory+"\\Database\\Students.accdb"), currentDB);
			
			log += location + ": Copying Student Images... ";
			FileUtils.copyDirectory(new File(directory+"\\CroppedMed"), new File(window.jobs+"\\"+location+"\\"+job+"\\CroppedMed"));
			new File(window.jobs+"\\"+location+"\\"+job+"\\RAW").mkdirs();
			
			log += " Complete!\n";
			gui.redrawTable();
		}
		catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Onsite Setup: "+e);}
	}
}
