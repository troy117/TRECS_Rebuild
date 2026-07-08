package photo.software.render;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Scanner;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

import org.apache.commons.io.FileUtils;

import photo.software.orders.plans.PackagePlan;

public class RenderPrep 
{
	private ArrayList<PackagePlan> selectedPlan;
	private ArrayList<RenderOrder> renderPrepList;
	public RenderPrep(ArrayList<RenderOrder> renderPrepList, ArrayList<PackagePlan> selectedPlan)
	{
		this.renderPrepList = renderPrepList;
		this.selectedPlan = selectedPlan;
		JFileChooser chooser = new JFileChooser();
		chooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = chooser.showOpenDialog(null);
		if(returnVal == JFileChooser.APPROVE_OPTION)
		{
			startPrep(chooser.getSelectedFile());
		}
	}
	private String proper(String name)
	{
		String output= name.substring(0,1).toUpperCase() 
				+ name.substring(1).toLowerCase();		
		return output;
	}
	private void startPrep(File folder)
	{
		File f,r,m;
		String[] code;
		String temp;
		boolean retouch   = false;
		boolean containsp = false;
		try
		{
			//This will identify all the items that need to be prepped
			ArrayList<String> prep = new ArrayList<String>();
			try
			{

				File orderPrep = new File("TEMPLATES\\ORDER_PREP_ITEMS.txt");
				String prepLine;
				if(orderPrep.exists())
				{
					Scanner orderPrepScanner = new Scanner(orderPrep);
					while(orderPrepScanner.hasNext())
					{
						prepLine = orderPrepScanner.nextLine();
						if(!prepLine.contains("\\\\")) prep.add(prepLine);
						
					}
					orderPrepScanner.close();
				}else JOptionPane.showMessageDialog(null, "ORDER_PREP_ITEMS.txt File does not exist!");
			}catch(Exception e){JOptionPane.showMessageDialog(null, "ERROR WITH ORDER_PREP_ITEMS FILE!");}
			
			f = new File(folder+"\\ImageSource");
			f.mkdirs();
			r = new File(folder+"\\Retouching");
			r.mkdirs();
			//This is the writer that will list the images and the prep functions that need to be called.
			PrintWriter pw = new PrintWriter(new BufferedWriter(new FileWriter(f+"\\OrderPrep.txt",true)));
			
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
											 +p.f[10]+", "+p.f[11]+", "+p.f[12]+", "+p.f[13]+", "+p.f[14]+", ";
							break;
						}
					}
				}
				if(temp.contains("Retouching"))
				{
					retouch = true;
					File copiedFile = new File(r+"\\Retouching\\"+s.image);
					if(!copiedFile.exists()) FileUtils.copyFile(new File(s.jobFolder+"\\CroppedLarge\\"+s.image), new File(r+"\\"+s.image));
				}
				if(temp.contains("MemoryMate"))
				{
					m = new File(folder+"\\MemoryMate");
					m.mkdirs();
					new File(folder+"\\MemoryMate\\Done").mkdir();
					try {
						FileUtils.copyFile(new File(s.jobFolder+"\\CroppedLarge\\"+s.image), new File(m+"\\"+s.image));
						if(!(new File(m+"\\"+s.homeroom+".png").exists())) FileUtils.copyFile(new File(s.jobFolder+"\\MemoryMateTemplates\\"+s.homeroom+".png"), new File(m+"\\"+s.homeroom+".png"));
						PrintWriter vig = new PrintWriter(new BufferedWriter(new FileWriter(m+"\\MemoryMate.txt",true)));
						vig.println(s.image+"\t"+s.homeroom+"\t"+s.last+"\t"+proper(s.first));
						vig.close();
					}
					catch (IOException e) {JOptionPane.showMessageDialog(null, "Error With: "+s.first+" "+s.last+": "+e);}	
				
				}
				
				//This will copy all the images to the folder, and list the actions that need to be performed.
				for(String p:prep)
				{
					if(temp.contains(p))
					{
						containsp = true;
						File copiedFile = new File(f+"\\ImageSource\\"+s.image);
						if(!copiedFile.exists()) FileUtils.copyFile(new File(s.jobFolder+"\\CroppedLarge\\"+s.image), new File(f+"\\"+s.image));
						pw.println(p+"\t"+s.image+"\t"+proper(s.first));
					}
				}
			}
			if(!retouch) r.delete();
			if(!containsp) f.delete();
			pw.close();
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error : "+e);}
		JOptionPane.showMessageDialog(null, "DONE!");

	}
}
