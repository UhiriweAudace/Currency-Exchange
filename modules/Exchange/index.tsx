import { Grid, Hidden, MenuItem, Select, TextField } from '@mui/material'
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react'
import coinLists from '../../public/crptoList.json';
import { debounce } from '../../utils';

const PrimaryButton = styled(Button)(`
  text-transform: none;
  box-shadow: none;
  background-color: #49CD5E;
  &:hover {
    background-color: #49CD5E;
  }
`);

const Flag = styled("img")(`
  height: 25px;
  width: 25px;
  border-radius: 50%;
  object-fit: cover;
`);

const UnvailableFlag = styled('span')(`
  height: 25px;
  padding: 3.5px;
  font-size: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: #FFFFFF;
  background-color: #374151;
`);

const Wrapper = styled(Box)(`
  position: relative;
  width: 100%;
`);

const Loader = styled('div')(`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
  width: 100%;
  height: 100%;
  background-color: #37415182;
`);

const cryptoList = Object.values(coinLists.crypto);
const fiatList = Object.keys(coinLists.fiat);
const currency = coinLists.fiat as Record<string, string>;
const unvailableFlags = ['LVL', 'CLF', 'BYR', 'CUC', 'SDG', 'XAU', 'XAG', 'XDR', 'ZMK', 'ZWL']

const Exchange = () => {
    const [currencyFrom, setCurrencyFrom] = useState('BTC')
    const [amountCurrencyFrom, setAmountCurrencyFrom] = useState(1)
    const [currencyTo, setCurrencyTo] = useState('USD')
    const [open, setOpen] = useState(false)
    const [converter, setConverterData] = useState(null);
    const [error, setError] = useState({
        currencyTo: null,
        currencyFrom: null
    });

    const [loading, setLoading] = useState(true);

    const makeExchange = async (target: string) => {
        return await axios.post('/api/live', { target })
    }

    useEffect(() => {
        makeExchange(currencyTo).then(({ data }) => {
            setConverterData(data.rates)
            setLoading(false)
        }).catch((e) => setLoading(false));
    }, [])


    return (
        <Wrapper boxShadow="0 2px 4px #ccc" py={6}>
            <Container>
                <Typography variant="h6" fontWeight="bold" mb={2}>Exchange</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={2.5}>
                        <Box>
                            <Typography>Currency from</Typography>
                            <TextField
                                select
                                size="small"
                                value={currencyFrom}
                                fullWidth
                                onChange={async (e) => {
                                    setCurrencyFrom(e.target.value)
                                    setLoading(true);
                                    await new Promise((resolve) => setTimeout(resolve, 2000))
                                    setLoading(false);
                                }}
                            >
                                {
                                    cryptoList.map((crypto) => (
                                        <MenuItem value={crypto.symbol} key={crypto.symbol}>
                                            <Box display="flex" alignItems="center">
                                                <Flag src={crypto.icon_url} alt={crypto.name_full} />
                                                <Typography ml={0.5}>{crypto.name}</Typography>
                                            </Box>
                                        </MenuItem>))
                                }
                            </TextField>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={2.5}>
                        <Box>
                            <Typography>Amount</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                autoComplete="off"
                                defaultValue={1}
                                error={Boolean(error.currencyFrom)}
                                inputProps={{ inputMode: 'decimal', pattern: '^[0-9]+' }}
                                helperText={Boolean(error.currencyFrom) && error.currencyFrom}
                                onChange={debounce(async (e: ChangeEvent<HTMLInputElement>) => {
                                    if (!e?.target?.value) return;
                                    // await makeExchange();'
                                    console.log(e.target.value);
                                    setAmountCurrencyFrom(parseInt(e.target.value))
                                }, 500)}
                            />
                        </Box>
                    </Grid>

                    <Hidden mdDown>
                        <Grid item xs={0}>
                            <Box>
                                <Typography mb={1}>&nbsp;</Typography>
                                <Typography>=</Typography>
                            </Box>
                        </Grid>
                    </Hidden>

                    <Grid item xs={12} md={2.5}>
                        <Box>
                            <Typography>Currency to</Typography>
                            <Select
                                fullWidth
                                size="small"
                                value={currencyTo}
                                onOpen={() => setOpen(true)}
                                onClose={() => setOpen(false)}
                                onChange={(e) => {
                                    setCurrencyTo(e.target.value)
                                    setLoading(true)
                                    makeExchange(e.target.value).then(({ data }) => {
                                        setConverterData(data.rates)
                                        setLoading(false)
                                    })
                                }}
                            >
                                {
                                    fiatList.map((name) => (
                                        <MenuItem value={name} key={name}>
                                            <Box display="flex" alignItems="center">
                                                {
                                                    unvailableFlags.includes(name) ? <UnvailableFlag>{name}</UnvailableFlag> : (
                                                        <Flag
                                                            alt={name}
                                                            loading="lazy"
                                                            src={`/flags/${name.toLowerCase()}.png`}
                                                        />
                                                    )
                                                }
                                                <Typography ml={0.5}>{open ? currency?.[name] : name}</Typography>
                                            </Box>
                                        </MenuItem>))
                                }
                            </Select>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={2.5}>
                        <Box>
                            <Typography>Amount</Typography>
                            <TextField
                                size="small"
                                fullWidth
                                autoComplete="off"
                                // disabled={true}
                                value={amountCurrencyFrom * (converter ? converter?.[currencyFrom] : 1)}
                                error={Boolean(error.currencyTo)}
                                inputProps={{ inputMode: 'decimal', pattern: '^[0-9]+' }}
                                helperText={Boolean(error.currencyTo) && error.currencyTo}
                                onChange={debounce((e: ChangeEvent<HTMLInputElement>) => {
                                    if (!e?.target?.value) return;
                                    // setLoading(true);
                                    // makeExchange().then(({data}) =>{
                                    //   e.target.textContent= "34"
                                    // });
                                    console.log(parseInt(e.target.value, 10))
                                }, 1000)}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={1}>
                        <Box sx={{ marginTop: 3 }}>
                            <PrimaryButton variant="contained" className="bg-green-500 transform-none">Save</PrimaryButton>
                        </Box>
                    </Grid>

                </Grid>



            </Container>
            {loading &&
                <Loader>
                    <CircularProgress color="inherit" />
                </Loader>
            }
        </Wrapper>
    )
}

export default Exchange
