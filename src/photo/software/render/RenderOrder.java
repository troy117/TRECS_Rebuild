package photo.software.render;


/**
 * 
 * @author Troy
 *	Need to update code so that the imgFolder is correct based on package plan, for RenderOrderGUI and BatchOrderGui
 *
 */
public class RenderOrder 
{
	public String ref, image, imgFolder, plan, order, jobFolder, first, last, homeroom, grade, allItems,schoolName;
	public int sort;
	public RenderOrder()
	{
		ref = "";
		image = "";
		imgFolder = "";
		plan = "";
		order = "";
		jobFolder = "";
		first = "";
		last = "";
		homeroom = "";
		grade = "";
		allItems = "";
		schoolName = "";
		sort = 0;
	}
	public RenderOrder(RenderOrder o)
	{
		ref = o.ref;
		image = o.image;
		imgFolder = o.imgFolder;
		plan = o.plan;
		order = o.order;
		jobFolder = o.jobFolder;
		first = o.first;
		last = o.last;
		homeroom = o.homeroom;
		grade = o.grade;
		allItems = o.allItems;
		schoolName = o.schoolName;
		sort = o.sort;
	}
	/**
	 * 
	 * @param ref Student Reference Number
	 * @param image Student Image
	 * @param imgFolder Source Folder
	 * @param plan Package Plan
	 * @param order Order Code
	 * @param jobFolder Job Folder
	 * @param first First Name
	 * @param last Last Name
	 * @param homeroom Homeroom
	 * @param grade Grade
	 * @param schoolName School Name
	 * @param sort Render Sort (0 Last, 1 Grade, 2 Homeroom)
	 */
	public RenderOrder(String ref, String image, String imgFolder, String plan, String order, String jobFolder, 
			String first, String last, String homeroom, String grade, String schoolName, int sort)
	{
		this.ref = ref;
		this.image = image.toLowerCase();
		this.imgFolder = imgFolder;
		this.plan = plan;
		this.order = order;
		this.jobFolder = jobFolder;
		this.first = first;
		this.last = last;
		this.homeroom = homeroom;
		this.grade = grade;
		this.schoolName = schoolName;
		this.allItems = "";
		this.sort = sort;
	}
	public String toString()
	{
		return "\nRef: "+ref+" Image: "+image+" ImgFolder: "+imgFolder+" Plan: "+plan+" Order: "+order+"\n"
				+"Job Folder: "+jobFolder+" First: "+first+" Last: "+last+" Homeroom: "+homeroom+" Grade: "+grade;
	}
}
