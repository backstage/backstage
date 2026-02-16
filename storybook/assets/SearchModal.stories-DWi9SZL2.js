import{j as t,W as u,K as p,X as g}from"./iframe-DagLMla0.js";import{r as h}from"./plugin-BoAXQpwJ.js";import{S as l,u as c,a as x}from"./useSearchModal-D4n2o-KW.js";import{s as S,M}from"./api-Dqsku-pT.js";import{S as C}from"./SearchContext-CSI-LEOT.js";import{B as m}from"./Button-CGsX4KgL.js";import{m as f}from"./makeStyles-VKdC8KiN.js";import{D as j,a as y,b as B}from"./DialogTitle-CMdXwEb9.js";import{B as D}from"./Box-C34VUoZ3.js";import{S as n}from"./Grid-FBCbfPk_.js";import{S as I}from"./SearchType-I-prCkH1.js";import{L as G}from"./List-CIhN5mci.js";import{H as R}from"./DefaultResultListItem-OKGtLTOZ.js";import{w as k}from"./appWrappers-_kxkBohz.js";import{SearchBar as v}from"./SearchBar-QDMX3bF5.js";import{S as T}from"./SearchResult-27GlLGud.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CMIyIdre.js";import"./Plugin-D3jLF9Nk.js";import"./componentData-D1PVJQzG.js";import"./useAnalytics-DGkcsGrL.js";import"./useApp-CHi7wILZ.js";import"./useRouteRef-DPppe71W.js";import"./index-IelGYWEf.js";import"./ArrowForward-BTrhSTNs.js";import"./translation-CkWZOnOR.js";import"./Page-CAywVXuZ.js";import"./useMediaQuery-DOUn7-C5.js";import"./Divider-BUPVmGFH.js";import"./ArrowBackIos-DUeIh3jv.js";import"./ArrowForwardIos-BsrNZlsb.js";import"./translation-Dbf1dgbL.js";import"./lodash-8eZMkpM5.js";import"./useAsync-cuavuARA.js";import"./useMountedState-CdgeShYt.js";import"./Modal-CPcAs759.js";import"./Portal-D3sdGGII.js";import"./Backdrop-BlEBkBi_.js";import"./styled-CaOR_WMz.js";import"./ExpandMore-B8FobaJl.js";import"./AccordionDetails-BcRR1tKu.js";import"./index-B9sM2jn7.js";import"./Collapse-CmcuBxUj.js";import"./ListItem-EqTaubpw.js";import"./ListContext-Ci5pu3kB.js";import"./ListItemIcon-Dagz1eml.js";import"./ListItemText-BKKXp1hx.js";import"./Tabs-QOkieCzf.js";import"./KeyboardArrowRight-BxDfUuI9.js";import"./FormLabel-4a8KeM0A.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Zhlr4yHU.js";import"./InputLabel-DGUjB0TN.js";import"./Select-kZWdAncG.js";import"./Popover-Cu6956KG.js";import"./MenuItem-BC3YY-V4.js";import"./Checkbox-Db3Aii-Q.js";import"./SwitchBase-BJKnSwT0.js";import"./Chip-C3Jdpeke.js";import"./Link-BU4ykdVL.js";import"./index-DHWmtkjs.js";import"./useObservable-ChLOd6s8.js";import"./useIsomorphicLayoutEffect-DrfkwYPr.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-UMOdROzp.js";import"./useDebounce-CnK7zXgW.js";import"./InputAdornment-CuEdyNUi.js";import"./TextField-DaiKk4qI.js";import"./useElementFilter-CG2zU8LZ.js";import"./EmptyState-DE7IjYMs.js";import"./Progress-CIvtCEGH.js";import"./LinearProgress-BgewR0pG.js";import"./ResponseErrorPanel-BnLrc1P4.js";import"./ErrorPanel-VpRUQ9Sx.js";import"./WarningPanel-BIOf-ulA.js";import"./MarkdownContent-DNeHSjqa.js";import"./CodeSnippet-BJQ1-T7X.js";import"./CopyTextButton-DsGjgVvC.js";import"./useCopyToClipboard-yj_91UtI.js";import"./Tooltip-C5pe82ax.js";import"./Popper-DphrlTbi.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
