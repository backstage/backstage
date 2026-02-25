import{j as t,Z as u,N as p,$ as g}from"./iframe-DTfizrde.js";import{r as h}from"./plugin-DYb8lzCj.js";import{S as l,u as c,a as x}from"./useSearchModal-Zwv55OPV.js";import{s as S,M}from"./api-BBX_jdKK.js";import{S as C}from"./SearchContext-Df2xVzSN.js";import{B as m}from"./Button-BiPWuW5b.js";import{m as f}from"./makeStyles-cQYMssxT.js";import{D as j,a as y,b as B}from"./DialogTitle-CE3UP1Yc.js";import{B as D}from"./Box-BJ9QCDuL.js";import{S as n}from"./Grid-CiU0LbEc.js";import{S as I}from"./SearchType-BdzK4S7X.js";import{L as G}from"./List-D_x_P-c5.js";import{H as R}from"./DefaultResultListItem-DEx1olg7.js";import{w as k}from"./appWrappers-D9r5PKQ-.js";import{SearchBar as v}from"./SearchBar-DoXbbcPQ.js";import{S as T}from"./SearchResult-CZcC90fS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cz-Rirhr.js";import"./Plugin-DI1wxenk.js";import"./componentData-BovlSqlB.js";import"./useAnalytics-Dnz6KMIA.js";import"./useApp-DWA61M3_.js";import"./useRouteRef-jzGMzpI2.js";import"./index-Btvc_mYP.js";import"./ArrowForward-DrwweVch.js";import"./translation-z6qQKUwe.js";import"./Page-BMr_gIIg.js";import"./useMediaQuery-Bxu_kSoa.js";import"./Divider-FNJvM-pk.js";import"./ArrowBackIos-0lF5adY_.js";import"./ArrowForwardIos-Bb-rLjW8.js";import"./translation-B4l9_lVD.js";import"./lodash-CVq2iuuf.js";import"./useAsync-B8iDfpP7.js";import"./useMountedState-ucond-iA.js";import"./Modal-UP6JYRoo.js";import"./Portal-DWz9hzP1.js";import"./Backdrop-C5fHwgIu.js";import"./styled-D7CkLDDF.js";import"./ExpandMore-Zq7wFUjN.js";import"./AccordionDetails-TZdQkQtk.js";import"./index-B9sM2jn7.js";import"./Collapse-BjWqbLIw.js";import"./ListItem-DW0UN9hL.js";import"./ListContext-D7hCMl_b.js";import"./ListItemIcon-BF8hzhOE.js";import"./ListItemText-g7zvfuTx.js";import"./Tabs-CW_2UXlJ.js";import"./KeyboardArrowRight-BdPVyCmJ.js";import"./FormLabel-DBjzk2rj.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-fH1OlxqH.js";import"./InputLabel-cJatbOt_.js";import"./Select-CADAs5HX.js";import"./Popover-QLUC5cRE.js";import"./MenuItem-D3_f0sYj.js";import"./Checkbox-KbVSZxWj.js";import"./SwitchBase-BP7-ZAO3.js";import"./Chip-B9ELYAiZ.js";import"./Link-CGOZa_jE.js";import"./index-DBIKoDFV.js";import"./useObservable-BVLn_DrS.js";import"./useIsomorphicLayoutEffect-VcRoELN2.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search--1EMhcdU.js";import"./useDebounce-O8Age4YJ.js";import"./InputAdornment-B44VUf_G.js";import"./TextField-DnqRkWE2.js";import"./useElementFilter-V6la0zxv.js";import"./EmptyState-Ct0SxBal.js";import"./Progress-BiZCOw_7.js";import"./LinearProgress-DwMeDNt8.js";import"./ResponseErrorPanel-DkJP8JzK.js";import"./ErrorPanel-NjJBAg1B.js";import"./WarningPanel-BErq6ILN.js";import"./MarkdownContent-D-gdOFlV.js";import"./CodeSnippet-DYevjl4R.js";import"./CopyTextButton-DEG2xp6B.js";import"./useCopyToClipboard-BsKLzoDq.js";import"./Tooltip-CiR2CeYH.js";import"./Popper-CDKiD4XM.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
