package photo.software.student.capture;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FilenameFilter;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Scanner;

import javax.swing.JOptionPane;

import org.apache.commons.io.FileUtils;


public class EndOfDay 
{
	ArrayList<RefImageLink> chosenLinks;
	public EndOfDay(String schoolPath, String user, String location)
	{
		chosenLinks = new ArrayList<RefImageLink>();
		boolean success = true;
		CaptureLogger log = new CaptureLogger(user);
		String timeStamp = new SimpleDateFormat("MM_dd_HH_mm").format(Calendar.getInstance().getTime());
		String computername="";
		try {
			computername = InetAddress.getLocalHost().getHostName();
		} catch (UnknownHostException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}
		File endOfDayFolder = new File(schoolPath+"\\"+timeStamp+"_END_OF_DAY_"+location+"_"+computername+"_"+user);
		try 
		{
			FileUtils.moveDirectory(new File("TrecsHotFolder"), endOfDayFolder);
			new File("TrecsHotFolder").mkdir();
		} 
		catch (IOException e1) 
		{
			log.write("Unable to move TrecsHotFolder: "+e1);
			JOptionPane.showMessageDialog(null, "Error moving TrecsHotFolder: "+e1);
			success = false;
		}
		if(success)
		{
			log = new CaptureLogger(endOfDayFolder+"\\_log.txt",user);
			log.write("Starting End of Day");
			
			String line, ref, img, renamedImageFileName,temp;
			File sourceImageFile;
			try 
			{
				//////Renames all the images photographed to contain reference number
				Scanner lineScanner = new Scanner(new File(endOfDayFolder+"\\_log.txt"));
				while(lineScanner.hasNext())
				{
					line = lineScanner.nextLine();
					if(line.contains("CaptureJPG")||line.contains("CaptureRAW"))
					{
						String l[] = line.split("\t");
						ref = l[3];
						img = l[4];
						sourceImageFile = new File(endOfDayFolder+"\\"+img);
						renamedImageFileName = img.substring(0,8)+"-"+ref+img.substring(8, 12);
						sourceImageFile.renameTo(new File(endOfDayFolder+"\\"+renamedImageFileName));
					}
				}
				lineScanner.close();
				
				//////Moves the chosen CR2 Files to a separate folder
				lineScanner = new Scanner(new File(endOfDayFolder+"\\_chosen.txt"));
				while(lineScanner.hasNext())
				{
					line = lineScanner.nextLine();
					if(line.contains("Chosen"))
					{
						String l[] = line.split("\t");
						updateChosenImageLink(new RefImageLink(l[3],l[4]));
					}
				}
				lineScanner.close();
				
				for(RefImageLink r:chosenLinks){r.image = r.image.toUpperCase().replace(".JPG", ".CR2");}
				(new File(endOfDayFolder+"\\ChosenRAW-"+user)).mkdir();
				for(RefImageLink r:chosenLinks)
				{
					temp = r.image.substring(0,8)+"-"+r.ref+r.image.substring(8,12);
					try {
						if(new File(endOfDayFolder+"\\"+temp).exists())
							FileUtils.moveFile(new File(endOfDayFolder+"\\"+temp),new File(endOfDayFolder+"\\ChosenRAW-"+user+"\\"+temp));
						else
						{
							//this should work for cr3s
							temp  = r.image.substring(0,8)+"-"+r.ref+r.image.substring(8,11)+"3";
							if(new File(endOfDayFolder+"\\"+temp).exists())
								FileUtils.moveFile(new File(endOfDayFolder+"\\"+temp),new File(endOfDayFolder+"\\ChosenRAW-"+user+"\\"+temp));
							else{
								log.write("RAW ERROR: "+temp +" does not exist as cr2 or cr3... did not transfer over to chosen RAW for ref: "+r.ref );
								JOptionPane.showMessageDialog(null, temp +" does not exist as cr2 or cr3... did not transfer over to chosen RAW for ref: "+r.ref );
							}
						}
					} catch (IOException e) {
						JOptionPane.showMessageDialog(null, "Yea... there's a problem moving a ChosenRAW image.  "+e);
						log.write("Yea... there's a problem moving a ChosenRAW image.  "+e);
					}
				}
				(new File(endOfDayFolder+"\\NotChosenRAW-"+user)).mkdir();
				File[] raws = endOfDayFolder.listFiles(new FilenameFilter(){
					public boolean accept(File arg0, String arg1) {
						if(arg1.toUpperCase().endsWith(".CR2")) return true;
						else if(arg1.toUpperCase().endsWith("CR3")) return true;
						return false;
					}
				});
				for(File r:raws)
				{
					try {
						FileUtils.moveFile(r, new File(endOfDayFolder+"\\NotChosenRAW-"+user+"\\"+r.getName()));
					} catch (IOException e) {
						JOptionPane.showMessageDialog(null, "Yea... there's a problem moving a NotChosenRAW image.  "+e);
						log.write("Yea... there's a problem moving a NotChosenRAW image.  "+e);
					}
				}
			} 
			catch (FileNotFoundException e1) 
			{
				JOptionPane.showMessageDialog(null, "Error in end of day line scanner: "+e1);
				log.write("Line Scanner Error: "+e1);
				success = false;
			}
			try 
			{
				FileUtils.copyFile(new File(schoolPath+"\\Database\\Students.accdb"), new File(endOfDayFolder+"\\Database\\Students.accdb"));
			} 
			catch (IOException e) 
			{
				log.write("!!!!!!Unable to Copy Student.accdb!!!!!!");
				success = false;
			}
			
			if(success)
			{
				log.write("END OF DAY SUCCESS!");
				JOptionPane.showMessageDialog(null, "END OF DAY SUCCESS!");	
			}
			else JOptionPane.showMessageDialog(null, "END OF DAY FAIL\nIf you see this let Troy know!");
			
		}
	}
	private void updateChosenImageLink(RefImageLink link)
	{
		boolean found = false;
		for(int i=0;i<chosenLinks.size();i++)
		{
			if(chosenLinks.get(i).ref.equals(link.ref))
			{
				found = true;
				chosenLinks.get(i).image = link.image;
				break;
			}
		}
		if(!found) chosenLinks.add(link);
	}
}
