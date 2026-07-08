package photo.software.league;

public class LeaguePlayer 
{
	public String ref, image, name1, name2, team, order;
	public LeaguePlayer(String ref, String image, String name1, String name2, String team, String order)
	{
		this.ref = ref;
		this.image = image;
		this.name1 = name1;
		this.name2 = name2;
		this.team = team;
		this.order = order;
	}
	public LeaguePlayer(LeaguePlayer p)
	{
		this.ref = p.ref;
		this.image = p.image;
		this.name1 = p.name1;
		this.name2 = p.name2;
		this.team = p.team;
		this.order = p.order;
	}
	public boolean equals(Object o)
	{
		if(o!=null & o instanceof LeaguePlayer)
		{
			return this.ref.equals(((LeaguePlayer)o).ref);
		}
		return false;
	}
}
