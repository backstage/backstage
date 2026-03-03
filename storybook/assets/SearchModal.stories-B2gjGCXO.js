import{j as t,W as u,K as p,X as g}from"./iframe-Bakz1Oty.js";import{r as h}from"./plugin-DgXM0K1q.js";import{S as l,u as c,a as x}from"./useSearchModal-DJtzncqv.js";import{s as S,M}from"./api-CCTktZIe.js";import{S as C}from"./SearchContext-ZyqUKz7h.js";import{B as m}from"./Button-Ccht4Qvd.js";import{m as f}from"./makeStyles-3_kuKRiN.js";import{D as j,a as y,b as B}from"./DialogTitle-BMwhGAjO.js";import{B as D}from"./Box-BnRbKBR1.js";import{S as n}from"./Grid-ORZV85AM.js";import{S as I}from"./SearchType-BiNUVnSg.js";import{L as G}from"./List-B_gy8x3o.js";import{H as R}from"./DefaultResultListItem-BhRPEzvP.js";import{w as k}from"./appWrappers-Ly4XQxgI.js";import{SearchBar as v}from"./SearchBar-C2D2357-.js";import{S as T}from"./SearchResult-YTVP3x2j.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Btt_wHH_.js";import"./Plugin-DgwZB82g.js";import"./componentData-BHNC7kMz.js";import"./useAnalytics-C-zfrdUt.js";import"./useApp-A6R3_jDs.js";import"./useRouteRef-DrBzD9TC.js";import"./index-DCOINpOM.js";import"./ArrowForward-B1DPH-0S.js";import"./translation-3YvzsgkK.js";import"./Page-DrZx5lVI.js";import"./useMediaQuery-CuP53YYC.js";import"./Divider-7y2QWIg8.js";import"./ArrowBackIos-B5ko0stB.js";import"./ArrowForwardIos-x-DzirXu.js";import"./translation-BTPtOpeL.js";import"./lodash-DgNMza5D.js";import"./useAsync-mZK1n-rv.js";import"./useMountedState-B1G3Agp-.js";import"./Modal-29C48Sgn.js";import"./Portal-CHaHYX6z.js";import"./Backdrop-CDEpDN0s.js";import"./styled-CVPCEBvL.js";import"./ExpandMore-Br5OM40x.js";import"./AccordionDetails-C_Yniy8T.js";import"./index-B9sM2jn7.js";import"./Collapse-CPJ3YqpA.js";import"./ListItem-CDsyXI4L.js";import"./ListContext-C1Qr8NkX.js";import"./ListItemIcon-CWyjocyZ.js";import"./ListItemText-G1PMliPa.js";import"./Tabs-BLAVSiJ6.js";import"./KeyboardArrowRight-DXHJ7Npg.js";import"./FormLabel-WJcegaCB.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DzItd2gw.js";import"./InputLabel-Dkloidq5.js";import"./Select-BYPaq-r0.js";import"./Popover-D1adgFrq.js";import"./MenuItem-CWxx6An5.js";import"./Checkbox-CmIWBWtU.js";import"./SwitchBase-E9xz_df7.js";import"./Chip-BaH2q5SC.js";import"./Link-CT1F1Kap.js";import"./index-D1b53K_1.js";import"./useObservable-cuHp5Jbv.js";import"./useIsomorphicLayoutEffect-uzj8S866.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-C2860-VI.js";import"./useDebounce-DZXpx19O.js";import"./InputAdornment-DURlc0ys.js";import"./TextField-C2DaVg1z.js";import"./useElementFilter-ZumuxKoV.js";import"./EmptyState-DtRAe0qR.js";import"./Progress-DkOhHR7y.js";import"./LinearProgress-CpejmlcQ.js";import"./ResponseErrorPanel-CRbtBJXw.js";import"./ErrorPanel-DYcTCw8V.js";import"./WarningPanel-D5WhcjPu.js";import"./MarkdownContent-CHVNvlVN.js";import"./CodeSnippet-C_df_a4F.js";import"./CopyTextButton-BHRhg4cl.js";import"./useCopyToClipboard-D5bdUPjr.js";import"./Tooltip-G4tQ9l7u.js";import"./Popper-BPZuuPZ9.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
