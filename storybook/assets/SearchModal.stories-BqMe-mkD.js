import{j as t,W as u,K as p,X as g}from"./iframe-3r6KqT77.js";import{r as h}from"./plugin-DRPhJgLQ.js";import{S as l,u as c,a as x}from"./useSearchModal-BGQ3ccQC.js";import{s as S,M}from"./api-BRFevgzw.js";import{S as C}from"./SearchContext-CUxwAyVi.js";import{B as m}from"./Button-B5od54yC.js";import{m as f}from"./makeStyles-DdJxAtYT.js";import{D as j,a as y,b as B}from"./DialogTitle-BLZJUtQ4.js";import{B as D}from"./Box-COPBbbCD.js";import{S as n}from"./Grid-BkUQ72Tl.js";import{S as I}from"./SearchType-CHNXJCXc.js";import{L as G}from"./List-Q1xNDAi1.js";import{H as R}from"./DefaultResultListItem-BUS3paRW.js";import{w as k}from"./appWrappers-BbV-pGDq.js";import{SearchBar as v}from"./SearchBar-B047NaIg.js";import{S as T}from"./SearchResult-CwZZUNsm.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CaFxnJBi.js";import"./Plugin-0AvTta7K.js";import"./componentData-D3SNqKl3.js";import"./useAnalytics-DIqfdXZ4.js";import"./useApp-BjW4qRdq.js";import"./useRouteRef-CiTgqH48.js";import"./index-DPtf701Z.js";import"./ArrowForward-CVxRmwGf.js";import"./translation-BtYwtWBU.js";import"./Page-ChUgiEW2.js";import"./useMediaQuery-HVxCtZMt.js";import"./Divider-7uj2S2j8.js";import"./ArrowBackIos-DtdWpMnj.js";import"./ArrowForwardIos-DiarcTbm.js";import"./translation-D-Bp1RhH.js";import"./lodash-DWIaGFFw.js";import"./useAsync-BjD5pkc0.js";import"./useMountedState-CY6UmiTA.js";import"./Modal-BbNfWHh7.js";import"./Portal-bXQToQAq.js";import"./Backdrop-qOe0ZYEJ.js";import"./styled-DMrvUlKV.js";import"./ExpandMore-3pu57d68.js";import"./AccordionDetails-C8AqI3GH.js";import"./index-B9sM2jn7.js";import"./Collapse-hTrcMAiL.js";import"./ListItem-CAuAnmh9.js";import"./ListContext-Bcxw2JhO.js";import"./ListItemIcon-DDreR8hs.js";import"./ListItemText-DfNXt3l7.js";import"./Tabs-ClynTZJF.js";import"./KeyboardArrowRight-C3XKJSHP.js";import"./FormLabel-C__x3_9u.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CYtxtffK.js";import"./InputLabel-DL5mS2AC.js";import"./Select-B7uF0Ai3.js";import"./Popover-Bw2lVm85.js";import"./MenuItem-DyYUZFKo.js";import"./Checkbox-DesRY8Hb.js";import"./SwitchBase-DP8WioCR.js";import"./Chip-2wD6EHlO.js";import"./Link-Cai-SmHt.js";import"./index-Cl6LIb1L.js";import"./useObservable-Buz33mzF.js";import"./useIsomorphicLayoutEffect-Dj5S2SUP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Nuc0vZnf.js";import"./useDebounce-C3XDoXlV.js";import"./InputAdornment-Dr2miDez.js";import"./TextField-B2dsibeG.js";import"./useElementFilter-DJPHOdKB.js";import"./EmptyState-B5Rned2-.js";import"./Progress-Ep011Ytz.js";import"./LinearProgress-B5yukPc4.js";import"./ResponseErrorPanel-Bs8ZkMCw.js";import"./ErrorPanel-BVejMlYf.js";import"./WarningPanel-BSNARVQ9.js";import"./MarkdownContent-BGi0QGK9.js";import"./CodeSnippet-DFGIuDUP.js";import"./CopyTextButton-DI6hq-av.js";import"./useCopyToClipboard-P1LGVeth.js";import"./Tooltip-CG5wnqUK.js";import"./Popper-BlVfoq_o.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
