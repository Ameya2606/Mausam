import asyncio
from app.providers.mock import MockWeatherProvider
from app.models.user_context import UserContext


def test_mock_provider_scenarios():
    async def run():
        provider = MockWeatherProvider()
        
        # Test Mumbai Monsoon scenario
        mumbai_weather = await provider.get_weather(19.07, 72.87, scenario="mumbai_monsoon")
        assert mumbai_weather.location.name == "Mumbai"
        assert mumbai_weather.current.precipitation_probability >= 80
        assert len(mumbai_weather.alerts) > 0
        assert mumbai_weather.marine is not None

        # Test Delhi Smog scenario
        delhi_weather = await provider.get_weather(28.61, 77.20, scenario="delhi_smog")
        assert delhi_weather.location.name == "New Delhi"
        assert delhi_weather.current.aqi > 300
        assert delhi_weather.current.aqi_category == "Severe"

    asyncio.run(run())

