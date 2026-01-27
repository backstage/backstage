import{j as t,m as u,I as p,b as g,T as h}from"./iframe-D7tLk4ld.js";import{r as x}from"./plugin-CJeyItKq.js";import{S as l,u as c,a as S}from"./useSearchModal-DFvx_cj0.js";import{B as m}from"./Button-z5kV09UR.js";import{a as M,b as C,c as f}from"./DialogTitle-D56g35nD.js";import{B as j}from"./Box-BQ6FCTAV.js";import{S as n}from"./Grid-DIKn7D0E.js";import{S as y}from"./SearchType-D1M1WTXf.js";import{L as I}from"./List-By8TLyAJ.js";import{H as B}from"./DefaultResultListItem-CnqhC-Xm.js";import{s as D,M as G}from"./api-BUdgNFzo.js";import{S as R}from"./SearchContext-D-ImOu9Y.js";import{w as T}from"./appWrappers-LFN562Aq.js";import{SearchBar as k}from"./SearchBar-1Q3jrZeD.js";import{a as v}from"./SearchResult-Cgg6aRyW.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BndmOlo_.js";import"./Plugin-B7Cc_-YL.js";import"./componentData-Dqkdwtuq.js";import"./useAnalytics-CQ9fO8VZ.js";import"./useApp-D_E3IHJo.js";import"./useRouteRef-BfGdJ_eX.js";import"./index-aaT1AT_u.js";import"./ArrowForward-C-Ay2WeA.js";import"./translation-Dbd4P2Pv.js";import"./Page-CqghFNE1.js";import"./useMediaQuery-BP5kBs-k.js";import"./Divider-Dcp5X0Oe.js";import"./ArrowBackIos-B1lOkBPS.js";import"./ArrowForwardIos-B3ALXZ8Z.js";import"./translation-8TzQ5zoO.js";import"./Modal-DgNAzS_W.js";import"./Portal-BczuNMGa.js";import"./Backdrop-Cyu771p_.js";import"./styled-C4zBw5eq.js";import"./ExpandMore-Br1SomQR.js";import"./useAsync-PQB885ej.js";import"./useMountedState-CdD92umV.js";import"./AccordionDetails-xzn6Vz4b.js";import"./index-B9sM2jn7.js";import"./Collapse-CJcP5srX.js";import"./ListItem-bVDpz6Z-.js";import"./ListContext-2_-4hUG0.js";import"./ListItemIcon-0fesE0Jk.js";import"./ListItemText-DUrf7V-S.js";import"./Tabs-BixttoK5.js";import"./KeyboardArrowRight-DdkiCZVO.js";import"./FormLabel-C6eEetQj.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-bXlwkDCf.js";import"./InputLabel-B-pXPnI8.js";import"./Select-DyhOzteH.js";import"./Popover-9B-RCRNY.js";import"./MenuItem-I4MCUMJg.js";import"./Checkbox-CEVJYrEW.js";import"./SwitchBase-CdBgof0M.js";import"./Chip-VEOz4QTW.js";import"./Link-B-Kks6_R.js";import"./lodash-Czox7iJy.js";import"./useObservable-D9uYqvSU.js";import"./useIsomorphicLayoutEffect-B8c2dJoh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CLKdfu0c.js";import"./useDebounce-DnBeiz4H.js";import"./InputAdornment-DZ-9Oytc.js";import"./TextField-B0GEB87Y.js";import"./useElementFilter-CO5L2oex.js";import"./EmptyState-Bjy6wW0I.js";import"./Progress-BQMBbkUc.js";import"./LinearProgress-BizOxAN6.js";import"./ResponseErrorPanel-CCxyXB0n.js";import"./ErrorPanel-CjfyCBSQ.js";import"./WarningPanel-waa_5WFz.js";import"./MarkdownContent-DEtoV9Sg.js";import"./CodeSnippet-i4EOu1Cg.js";import"./CopyTextButton-D-7TENHT.js";import"./useCopyToClipboard-DDHvggmk.js";import"./Tooltip-CJcYpKaL.js";import"./Popper-B109mB6A.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
