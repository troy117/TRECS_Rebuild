package photo.software.render;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Scanner;

import javax.swing.JOptionPane;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;

import photo.software.orders.plans.PackagePlan;

public class AddOnPrep 
{
	private ArrayList<PackagePlan> selectedPlan;
	private ArrayList<RenderOrder> renderPrepList;
	boolean isSpring;

	public AddOnPrep(ArrayList<RenderOrder> renderPrepList, ArrayList<PackagePlan> selectedPlan, File folder, String type)
	{
		this.renderPrepList = renderPrepList;
		this.selectedPlan = selectedPlan;
		isSpring = type.equals("Spring");

		startPrep(folder);

	}
	private String proper(String name)
	{
		String output= name.substring(0,1).toUpperCase() 
				+ name.substring(1).toLowerCase();		
		return output;
	}
	private void startPrep(File folder)
	{
		File f;
		String[] code;
		String temp;
		boolean used = false;
		try
		{
			//This will identify all the items that need to be prepped
			ArrayList<String> prep = new ArrayList<String>();
			try
			{

				File addOnPrep = new File("TEMPLATES\\ADDON_PREP_ITEMS.txt");
				String prepLine;
				if(addOnPrep.exists())
				{
					Scanner addOnPrepScanner = new Scanner(addOnPrep);
					while(addOnPrepScanner.hasNext())
					{
						prepLine = addOnPrepScanner.nextLine();
						if(!prepLine.contains("\\\\")) prep.add(prepLine);
						
					}
					addOnPrepScanner.close();
				}else JOptionPane.showMessageDialog(null, "ADDON_PREP_ITEMS.txt File does not exist!");
			}catch(Exception e){JOptionPane.showMessageDialog(null, "ERROR WITH ORDER_PREP_ITEMS FILE!");}
			
			//This is the folder that all the images that need to be prepped will be copied to.
			f = new File(folder+"\\AddonImageSource");
			f.mkdirs();
			
			//This is the writer that will list the images and the prep functions that need to be called.
			PrintWriter pw = new PrintWriter(new BufferedWriter(new FileWriter(f+"\\AddOnPrep.txt",true)));
			
			//This goes through all the students orders and lists all the items they are purchasing.
			for(RenderOrder s:renderPrepList)
			{
				//This lists out all the items that are being purchased
				temp="";
				code = s.order.split("\\.");
				for(String c:code)
				{
					for(PackagePlan p:selectedPlan)
					{
						if(p.code.equals(c))
						{
							temp+=p.name+": "+p.f[0]+", "+p.f[1]+", "+p.f[2]+", "+p.f[3]+", "+p.f[4]+", "
									+p.f[5]+", "+p.f[6]+", "+p.f[7]+", "+p.f[8]+", "+p.f[9]+", "
									+p.f[10]+", "+p.f[11]+", "+p.f[12]+", "+p.f[13]+", "+p.f[14];
							break;
						}
					}
				}

				int count=0;
				
				//This will copy all the images to the folder, and list the actions that need to be performed.
				for(String p:prep)
				{
					count = StringUtils.countMatches(temp, p);
					for(int i=0;i<count;i++)
					{
						File copiedFile = new File(f+"\\AddonImageSource\\"+s.image);
						if(!copiedFile.exists())
						{
							if(isSpring) FileUtils.copyFile(new File(s.jobFolder+"\\CroppedLargeWithBorder\\"+s.image), new File(f+"\\"+s.image));
							else FileUtils.copyFile(new File(s.imgFolder+"\\"+s.image), new File(f+"\\"+s.image));
						}
						
						if(s.sort==0) pw.println(p+"\t"+s.image+"\t"+s.last+"\t"+s.last+"\t"+proper(s.first));
						else if(s.sort==1) pw.println(p+"\t"+s.image+"\t"+s.grade+"\t"+s.last+"\t"+proper(s.first));
						else pw.println(p+"\t"+s.image+"\t"+s.homeroom+"\t"+s.last+"\t"+proper(s.first));
						used = true;
					}
				}
			}
			if(!used) f.delete();
			pw.close();
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error : "+e);}

	}
}
