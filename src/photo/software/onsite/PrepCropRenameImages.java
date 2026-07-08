package photo.software.onsite;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

import photo.software.comparators.ImageFileComparator;

public class PrepCropRenameImages 
{
	File endOfDayFolder;
	String report = "";
	public PrepCropRenameImages()
	{
		JFileChooser fc = new JFileChooser("Choose School Folder Containing End Of Days");
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showDialog(null, "End of Days Folder");
		if(returnVal == JFileChooser.APPROVE_OPTION)
		{
			endOfDayFolder = fc.getSelectedFile();
			ArrayList<File> files = new ArrayList<File>();
			listImageFiles(endOfDayFolder.getAbsolutePath(),files);
			Collections.sort(files,new ImageFileComparator());
			
			String fileName;
			String currentRef;
			String folder;
			for(int i=0;i<files.size();i++)
			{
				fileName = files.get(i).getName();
				if(fileName.contains("MG_")&&fileName.length()>12)
				{
					currentRef = fileName.substring(fileName.indexOf("-")+1,fileName.indexOf("."));
					if(!refExists(files,currentRef,i))
					{
						folder = files.get(i).getParent();
						files.get(i).renameTo(new File(folder+"\\"+currentRef+".JPG"));
					}
				}
				if(!report.equals(""))
				{
					try {
						BufferedWriter writer = new BufferedWriter(new FileWriter(new File(endOfDayFolder+"\\report.txt")));
						writer.write(report);
						writer.close();
					} catch (IOException e) {
						JOptionPane.showMessageDialog(null, "Error Creating Report: "+e);
					}
				}
			}
		}
	}
	public void listImageFiles(String directoryName, ArrayList<File> files) {
	    File directory = new File(directoryName);
	    File[] fList = directory.listFiles();
	    for (File file : fList) {
	        if ((file.isFile())&&(file.getName().toUpperCase().endsWith(".JPG"))) {
	            files.add(file);
	        } else if (file.isDirectory()) {
	        	listImageFiles(file.getAbsolutePath(), files);
	        }
	    }
	}
	public boolean refExists(ArrayList<File> files, String ref, int current)
	{
		for(int i=0;i<files.size();i++)
		{
			if((i!=current)&&(files.get(i).getName().contains(ref)))
			{
				report+=ref+":\t"+files.get(i).getParent().substring(files.get(i).getParent().lastIndexOf("-")+1)+"\t"+files.get(i).getName()+"\n";
				return true;
			}
		}
		return false;
	}
	
	
	
}
