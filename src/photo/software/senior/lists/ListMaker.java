package photo.software.senior.lists;

import java.util.ArrayList;

import photo.software.senior.Senior;


public class ListMaker 
{
	
	private ArrayList<Senior> seniors;
	
	
	public ListMaker(ArrayList<Senior> seniors)
	{
		this.seniors=seniors;
		
	}
	public String[][] toTableArray()
	{
		String[][] information = new String[seniors.size()][6];
		for(int i=0;i<seniors.size();i++)
		{
			information[i][0] = seniors.get(i).ref;
			information[i][1] = seniors.get(i).last;
			information[i][2] = seniors.get(i).first;
			information[i][4] = seniors.get(i).ID;
			information[i][5] = seniors.get(i).homeroom;
		}
		return information;
	}
}
