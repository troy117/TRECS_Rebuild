package photo.software.senior;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.swing.JOptionPane;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.healthmarketscience.jackcess.Cursor;
import com.healthmarketscience.jackcess.CursorBuilder;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.IndexCursor;
import com.healthmarketscience.jackcess.Row;
import com.healthmarketscience.jackcess.Table;

import photo.software.comparators.ListSortComparator2;
import photo.software.comparators.SeniorReferenceSortComparator;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.senior.lists.ListItem;


public class Seniors 
{
	private ArrayList<Senior> seniors;
	private ArrayList<ListItem> list;
	private ArrayList<String> listNames;
	
	private String fallPath,schoolPath;
	private Database db;
	private Table table, listTable;
	public Senior current;
	public int currentIndex;
	private File file;
	private UniqueCodeGenerator codeGenerator;
	public Seniors(DesktopWindow window, JobData job)
	{

		file = new File(window.jobs+"\\"+job.location+"\\"+job.job+"\\Database\\Seniors.accdb");
		schoolPath = window.jobs+"\\"+job.location+"\\"+job.job+"\\";
		
	}
	
	public Senior getSenior(String ref)
	{
		for(Senior s:seniors)
			if(s.ref.equals(ref))
				return s;
		return null;
	}
	
	public String getFallPath() {return fallPath;}
	public void loadListDatabase()
	{
		list = new ArrayList<ListItem>();
		listNames = new ArrayList<String>();
		try
		{
			db = DatabaseBuilder.open(file);
			listTable = db.getTable("Lists");
			String[] data = new String[2];
			for(Row row:listTable) 
			{
				try{data[0] = row.get("List").toString().trim();}catch(NullPointerException e){data[0]="";}
				try{data[1] = row.get("ReferenceNumber").toString().trim();}catch(NullPointerException e){data[1]="";}
				if(data[0].equals("")&&data[1].equals("")) break;
				Senior temp = null;
				for(Senior s:seniors)
				{
					if(s.ref.equals(data[1])){
						temp = s;
						break;
					}
				}
				if(temp!=null){
				if(!temp.ref.equals("")) list.add(new ListItem(data[0],temp));
				if(!listNames.contains(data[0])) listNames.add(data[0]);}
			}
			
			
			
			
			
			
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Lists: "+e);}
	}
	public ArrayList<String> getListNames()
	{
		Collections.sort(listNames);
		return listNames;
	}
	public String[] getListNamesArray()
	{
		Collections.sort(listNames);
		String[] list = new String[listNames.size()];
		for(int i=0;i<list.length;i++) 
		{
			list[i]=listNames.get(i);
		}
		return list;
	}
	public void addSeniorToList(String listName, String ref, Boolean duplicatesAllowed)
	{
		try
		{
			Boolean exists = false;
			if(!duplicatesAllowed)
			{
				for(ListItem l:list)
				{
					if(l.getList().equals(listName))
					{
						if(l.getSenior().ref.equals(ref))
						{
							exists = true;
							break;
						}
					}
				}
			}
			if(!exists)
			{
				listTable.addRow(listName,ref);
				list.add(new ListItem(listName,getSenior(ref)));
				if(!listNames.contains(listName)) listNames.add(listName);
			}	

		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Adding Student: "+ref);}
	}
	public void removeStudentFromList(String listName, String ref)
	{
		try
		{
			Map<String,Object> rowPattern = new HashMap<String,Object>();
			rowPattern.put("List", listName);
			rowPattern.put("ReferenceNumber", ref);
			Cursor curse = CursorBuilder.createCursor(listTable);
			curse.findFirstRow(rowPattern);
			curse.deleteCurrentRow();
			for(ListItem l:list)
			{
				if(l.getList().equals(listName))
				{
					if(l.getSenior().ref.equals(ref))
					{
						list.remove(l);
						removeList(listName);
						break;
					}
				}
			}

		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Removing Student");}
	}
	private void removeList(String listName)
	{
		for(ListItem l:list)
		{
			if(l.getList().equals(listName)) return;
		}
		listNames.remove(listName);
	}
	public ArrayList<ListItem> getListItems()
	{
		Collections.sort(list,new ListSortComparator2());
		return new ArrayList<ListItem>(list);
	}
	public ArrayList<Senior> getStudentsFromList(String listName)
	{
		ArrayList<Senior> studentsInList = new ArrayList<Senior>();
		for(ListItem l:list)
		{
			if(l.getList().equals(listName)) studentsInList.add(l.getSenior());
		}
		return studentsInList;
	}

	
	
	/////////////////Senior Functions///////////////////'
	public boolean openStudentDatabase()
	{
		try
		{
			codeGenerator = new UniqueCodeGenerator();
			db = DatabaseBuilder.open(file);
			table = db.getTable("FallJob");
			try{fallPath = table.getNextRow().getString("FallJobPath").toString();}catch(NullPointerException e){fallPath = "";}
			table = db.getTable("Students");
			seniors = new ArrayList<Senior>();
			String[] temp = new String[8];
			for(Row row:table)
			{
				try{temp[0] = row.get("RefNum").toString();}catch(NullPointerException e){temp[0]="-1";}
				try{temp[1] = row.get("First").toString();}catch(NullPointerException e){temp[1]="";}
				try{temp[2] = row.get("Last").toString();}catch(NullPointerException e){temp[2]="";}
				try{temp[3] = row.get("StuID").toString();}catch(NullPointerException e){temp[3]="";}
				try{temp[4] = row.get("Homeroom").toString();}catch(NullPointerException e){temp[4]="";}
				try{temp[5] = row.get("Notes").toString();}catch(NullPointerException e){temp[5]="";}
				try{temp[6] = row.get("Orders").toString();}catch(NullPointerException e){temp[6]="";}
				try{temp[7] = row.get("Code").toString();}catch(NullPointerException e){temp[7]="";}
				
				codeGenerator.addExistingCode(temp[7]);
				seniors.add(new Senior(temp[0],temp[1],temp[2],temp[3],temp[4],temp[5],temp[6],temp[7]));
			}
			Collections.sort(seniors, new SeniorReferenceSortComparator());
			currentIndex=0;
			current = seniors.get(currentIndex);
		}catch(Exception e) {e.printStackTrace();}	
		//}catch(Exception e){JOptionPane.showMessageDialog(null, "Error somewhere loading student data.");return false;}
		return true;
	}
	public void loadOnlineOrders(File file)
	{
		String currentRef = current.ref;
		try {
			String content = new String(Files.readAllBytes(Paths.get(file.getAbsolutePath())));
			JSONArray jsonArray = new JSONArray(content);
			
			for(int i=0;i<jsonArray.length();i++)
			{
				JSONObject order = jsonArray.getJSONObject(i);
				String ref = order.getInt("Reference Number")+"";
				String orderNum = order.getInt("Order Number")+"";
				String trecsOrderJson = order.getString("TRECS ORDER JSON");
				
                
				if(search(ref))
				{
					current.notes+="Online Order: "+orderNum+"\n";
					mergeOrders(trecsOrderJson);
					saveSenior(current);
				}
			}
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		search(currentRef);
	}
	
	public void mergeOrders(String newOrdersJson)
	{
		try
		{
			JSONObject currentOrders = new JSONObject(current.orders == null || current.orders.isEmpty() ? "{}" : current.orders);
			JSONObject newOrders = new JSONObject(newOrdersJson);
			for (String key : newOrders.keySet()) {
                String newValue = newOrders.get(key).toString();
                
                // Check if the key exists in current orders
                if (currentOrders.has(key)) {
                    // Get the existing value and append the new value
                    String currentValue = currentOrders.get(key).toString();
                    String appendedValue = currentValue +"."+ newValue;
                    currentOrders.put(key, appendedValue);
                } else {
                    // If key does not exist, just put the new value
                    currentOrders.put(key, newValue);
                }
            }
            
            // Convert updated JSON object back to a string
            current.orders = currentOrders.toString();
		}catch(JSONException e) {JOptionPane.showMessageDialog(null, "Error parsing JSON: "+e.getLocalizedMessage());}
	}
	
	public void exportSeniorImages(String exportPath)
	{
		File exportFolder = new File(exportPath);
		File formalFolder = new File(exportPath+"\\Formal");
		formalFolder.mkdir();
		File circleFolder = new File(exportPath+"\\Circle");
		circleFolder.mkdir();
		String errors = "";
		JSONObject ordersJson = null;

		try
		{
			for(Senior s:seniors)
			{
				//System.out.println(s.ref+": "+s.orders);
				if(s.orders=="") s.orders = "{}";
				Boolean foundF = false, foundC=false;
				ordersJson = new JSONObject(s.orders);
				if (ordersJson != null) 
				{
					for (String imageName : ordersJson.keySet()) 
					{
						String codes = ordersJson.get(imageName).toString();
						String sourcePath = schoolPath + "//CroppedLarge//" + imageName;
						File sourceFile = new File(sourcePath);
												
						if (codes.toString().contains("33")||codes.toString().contains("63")) {
							File destFile = new File(formalFolder, imageName);
							try {
								Files.copy(sourceFile.toPath(), destFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
								appendToTextFile(formalFolder + "\\formal_info.txt", 
									String.format("%s\t%s\t%s\t%s\n", imageName, s.ID, s.first, s.last));
									foundF = true;
							} catch (IOException e) {
								errors += "Error copying formal image for " + s.ref + ": " + e.getMessage() + "\n";
							}
						}
						
						if (codes.toString().contains("34")||codes.toString().contains("64")) {
							File destFile = new File(circleFolder, imageName);
							try {
								Files.copy(sourceFile.toPath(), destFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
								appendToTextFile(circleFolder + "\\circle_info.txt", 
									String.format("%s\t%s\t%s\t%s\n", imageName, s.ID, s.first, s.last));
									foundC = true;
							} catch (IOException e) {
								errors += "Error copying circle image for " + s.ref + ": " + e.getMessage() + "\n";
							}
						}
					}
				}
				if(!foundF) errors+=s.ref+" has no Formal Selection.\n";
				if(!foundC) errors+=s.ref+" has no Circle Selection.\n";
				
			}
			if(errors!="")
			{
				appendToTextFile(exportFolder+"\\Errors.txt",errors);
			}
		}catch(JSONException e) {JOptionPane.showMessageDialog(null,"Error Exporting: "+e);}
	}
	private void appendToTextFile(String filePath, String content) {
		try {
			Files.write(Paths.get(filePath), content.getBytes(), 
				java.nio.file.StandardOpenOption.CREATE, 
				java.nio.file.StandardOpenOption.APPEND);
		} catch (IOException e) {
			System.err.println("Error writing to file: " + filePath);
			e.printStackTrace();
		}
	}
	public int size()
	{
		return seniors.size();
	}
	public void close()
	{
		if(db!=null) try {db.close();db=null;}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Closing Database: "+e);}
	}
	public void next()
	{
		if(currentIndex<seniors.size()-1) currentIndex++;
		else currentIndex=0;
		current = seniors.get(currentIndex);
	}
	public void previous()
	{
		if(currentIndex>0) currentIndex--;
		else currentIndex=seniors.size()-1;
		current = seniors.get(currentIndex);
	}
	public boolean search(String ref)
	{
		for(int i=0;i<seniors.size();i++)
		{
			if(seniors.get(i).ref.equals(ref))
			{
				currentIndex=i;
				current = seniors.get(currentIndex);
				return true;
			}
		}
		JOptionPane.showMessageDialog(null, "Unable to load reference #: "+ref);
		return false;
	}
	public void addBlank(int blankNum)
	{
		try
		{
			long lastRef = Long.parseLong(seniors.get(seniors.size()-1).ref);
			for(int i=0;i<blankNum;i++)
			{
				table.addRow(lastRef+1+i+"","","","","","","");
				seniors.add(new Senior(lastRef+1+i+""));
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Adding Blank: "+e);}

	}
	public boolean addStudents(ArrayList<Senior> addSeniors)
	{
		try
		{
			long lastRef = Long.parseLong(seniors.get(seniors.size()-1).ref);
			Senior temp;
			for(int i=0;i<addSeniors.size();i++)
			{
				temp = addSeniors.get(i);
				temp.ref = lastRef+1+i+"";
				addSenior(temp);
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Adding Blank: "+e);return false;}
		
		
		return true;
	}
	private void addSenior(Senior s) throws NumberFormatException, IOException
	{
		table.addRow(s.ref,s.first,s.last,s.ID,s.homeroom,s.notes,s.orders,s.code);
		seniors.add(s);
	}
	public void updateStudents(ArrayList<Senior> update)
	{
		for(Senior s:update)
		{
			saveSenior(s);
		}
	}


	public boolean saveSenior(Senior s)
	{
		try
		{
			if(!seniors.contains(s))
			{
				table.addRow((Long.parseLong(seniors.get(seniors.size()-1).ref)+1)+"",
						s.first,s.last,s.ID,s.homeroom,s.notes,s.orders,s.code);
				seniors.add(s);
				return true;
			}
			else
			{
				IndexCursor cursor = CursorBuilder.createCursor(table.getPrimaryKeyIndex());
				boolean found = cursor.findFirstRow(Collections.singletonMap("RefNum", Long.parseLong(s.ref)));
				if(found)
				{
					cursor.updateCurrentRow(s.ref,s.first,s.last,s.ID,s.homeroom,s.notes,s.orders,s.code);
					for(Senior stu:seniors)
					{
						if(stu.equals(s))
						{
							stu = s;
							return true;
						}
					}
				}
			}
		}catch(Exception err){JOptionPane.showMessageDialog(null, "Fail!  Unable to add/save missing Student: "+err);}
		return false;
	}
	
	public ArrayList<Senior> getSeniors() {return new ArrayList<Senior>(seniors);}
	public Senior setCurrentSenior(String ref)
	{
		for(int i=0;i<seniors.size();i++)
		{
			if(seniors.get(i).ref.equals(ref))
			{
				current = seniors.get(i);
				currentIndex = i;
				return current;
			}
		}
		current = seniors.get(0);
		JOptionPane.showMessageDialog(null, "Unable to set Current student to: "+ref+": Setting ref to: "+seniors.get(0).ref);
		return current;
	}

}
