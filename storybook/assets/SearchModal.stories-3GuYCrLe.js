import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-mdeHk8Us.js";import{r as x}from"./plugin-Bfaq3gI2.js";import{S as l,u as c,a as S}from"./useSearchModal-txcz0-lH.js";import{s as M,M as C}from"./api-DMjNQc1b.js";import{S as f}from"./SearchContext-DSdjSGbp.js";import{B as m}from"./Button-DaFlKZgy.js";import{D as j,a as y,b as B}from"./DialogTitle-CmcGNy32.js";import{B as D}from"./Box-C_VvrdzU.js";import{S as n}from"./Grid-DC2Tywm3.js";import{S as I}from"./SearchType-CIkaFYs1.js";import{L as G}from"./List-X7Jezm93.js";import{H as R}from"./DefaultResultListItem-BclWXD8H.js";import{w as k}from"./appWrappers-BH9LHHFZ.js";import{SearchBar as v}from"./SearchBar-DhP3dFGZ.js";import{S as T}from"./SearchResult-DwErV8sM.js";import"./preload-helper-PPVm8Dsz.js";import"./index-cHl5grIV.js";import"./Plugin-BR79PUs9.js";import"./componentData-DyMAqMyS.js";import"./useAnalytics-Cte0NGRl.js";import"./useApp-DWNk4MUY.js";import"./useRouteRef-BPPz61H3.js";import"./index-DhB3CqmG.js";import"./ArrowForward-BEuLEQbk.js";import"./translation-DYFP9LS-.js";import"./Page-CaI2vE31.js";import"./useMediaQuery-BWAV4mKr.js";import"./Divider-GxHdmRdJ.js";import"./ArrowBackIos-B1zUrfHX.js";import"./ArrowForwardIos-DS15Hsux.js";import"./translation-BdGX5bl7.js";import"./lodash-Czox7iJy.js";import"./useAsync-DlW7WdkC.js";import"./useMountedState-DqT-X8D-.js";import"./Modal-uDaBb03U.js";import"./Portal-CGi5eRlN.js";import"./Backdrop-B1KztC8w.js";import"./styled-BGP2DNJW.js";import"./ExpandMore-4uaBqvpS.js";import"./AccordionDetails-CY4b5vf9.js";import"./index-B9sM2jn7.js";import"./Collapse-B45VguHP.js";import"./ListItem-L1zDUeu9.js";import"./ListContext-EwKgne2S.js";import"./ListItemIcon-B0U3jXLs.js";import"./ListItemText-DCPofTJa.js";import"./Tabs-E3zWl57m.js";import"./KeyboardArrowRight-COu5_TKX.js";import"./FormLabel-56XIh7zy.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C5FyOWbH.js";import"./InputLabel-CeZbq5P4.js";import"./Select-DrA9FN7O.js";import"./Popover-CAGK532k.js";import"./MenuItem-BP4Yk4Ue.js";import"./Checkbox-DobnNKQ5.js";import"./SwitchBase-CwRILYWQ.js";import"./Chip-DWQI7zgn.js";import"./Link-dvajx9JY.js";import"./useObservable-BYYos0JC.js";import"./useIsomorphicLayoutEffect-Bz91LDOF.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DemPdblt.js";import"./useDebounce-NabSi6Gj.js";import"./InputAdornment-DFyjC_-A.js";import"./TextField-CH3MV9OK.js";import"./useElementFilter-CiO2PdTb.js";import"./EmptyState-CuSw98U0.js";import"./Progress-CbK3yAZj.js";import"./LinearProgress-Dz3FTUvM.js";import"./ResponseErrorPanel-DJSw6oRK.js";import"./ErrorPanel-De8J-gDX.js";import"./WarningPanel-Cg3FNdiM.js";import"./MarkdownContent-DOJrLrbX.js";import"./CodeSnippet-DzFJqA_2.js";import"./CopyTextButton-BqpZzKnD.js";import"./useCopyToClipboard-DVW_Y7r9.js";import"./Tooltip-BRtijnu7.js";import"./Popper-D5LaxFiz.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
