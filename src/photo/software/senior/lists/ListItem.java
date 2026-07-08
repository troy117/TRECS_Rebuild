package photo.software.senior.lists;

import photo.software.senior.Senior;

public class ListItem 
{
	private String list;
	private Senior senior;
	public ListItem(String list, Senior senior)
	{
		this.list = list;
		this.senior = senior;
	}
	public String getList()
	{
		return list;
	}
	public Senior getSenior()
	{
		return senior;
	}
}
