import{j as t,m as u,I as p,b as g,T as h}from"./iframe-C6d4amxQ.js";import{r as x}from"./plugin-VtboVFOA.js";import{S as l,u as c,a as S}from"./useSearchModal-DH_Bqh7W.js";import{B as m}from"./Button-Cu6BkngO.js";import{a as M,b as C,c as f}from"./DialogTitle-C6vJC5fn.js";import{B as j}from"./Box-yXRZ3Xp2.js";import{S as n}from"./Grid-WtUylni-.js";import{S as y}from"./SearchType-CadT6FSp.js";import{L as I}from"./List-qMmGjvCV.js";import{H as B}from"./DefaultResultListItem-BpExpKA7.js";import{s as D,M as G}from"./api-CFhZfUf8.js";import{S as R}from"./SearchContext-Ckc5PXBu.js";import{w as T}from"./appWrappers-BuwXBYCY.js";import{SearchBar as k}from"./SearchBar-DMi9V1Gh.js";import{a as v}from"./SearchResult-CejIEHCl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CJjJYq6V.js";import"./Plugin-C7MtdO6s.js";import"./componentData-BhUIek-Q.js";import"./useAnalytics-CEJvE44e.js";import"./useApp-BUIf5wuk.js";import"./useRouteRef-D7G3Qpmz.js";import"./index-Bwu9Fyg1.js";import"./ArrowForward-CERyzcOO.js";import"./translation-CjwB4UzU.js";import"./Page-CHu6BMKX.js";import"./useMediaQuery-CWOHA7aL.js";import"./Divider-BlWYsQ2U.js";import"./ArrowBackIos-CFUNA89z.js";import"./ArrowForwardIos-Blv2mkuK.js";import"./translation-CAg_xGpF.js";import"./Modal-D1YXIVhd.js";import"./Portal-B6ENv45o.js";import"./Backdrop-DBUbh-8q.js";import"./styled-BGGy5Grm.js";import"./ExpandMore--4wftT15.js";import"./useAsync-C2weF2sY.js";import"./useMountedState-C6W4VPdE.js";import"./AccordionDetails-BgOvrYOY.js";import"./index-B9sM2jn7.js";import"./Collapse-Di3lEKwf.js";import"./ListItem-CUGV6Izn.js";import"./ListContext-Baa1QRS6.js";import"./ListItemIcon-CHICEp0x.js";import"./ListItemText-DmvyJhay.js";import"./Tabs-B_dtE6iP.js";import"./KeyboardArrowRight-CcL0A3b2.js";import"./FormLabel-DHrmkS6P.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CzoWM_jf.js";import"./InputLabel-DTrjmWNd.js";import"./Select-DEVQzAOY.js";import"./Popover-BUbOGoXS.js";import"./MenuItem--axzyL0w.js";import"./Checkbox-Cb4ujCjq.js";import"./SwitchBase-DBhrWHDW.js";import"./Chip-q8Ev9GF9.js";import"./Link-xhhwyYCu.js";import"./lodash-DLuUt6m8.js";import"./useObservable-9WiB_7an.js";import"./useIsomorphicLayoutEffect-DMZDbwPJ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BiQ5wUh7.js";import"./useDebounce-NQUzqkwD.js";import"./InputAdornment-C2tKQKQM.js";import"./TextField-Bto6RwlD.js";import"./useElementFilter-C9B-vPkc.js";import"./EmptyState-mXC2cpxt.js";import"./Progress-CsXkQXV4.js";import"./LinearProgress-YmA4jlO6.js";import"./ResponseErrorPanel-DnithY1L.js";import"./ErrorPanel-C4TycXbx.js";import"./WarningPanel-C-jRLCTC.js";import"./MarkdownContent-BYJW4Slr.js";import"./CodeSnippet-3cP_Pubp.js";import"./CopyTextButton-CE5xtLZ0.js";import"./useCopyToClipboard-CH_VlaT9.js";import"./Tooltip-5RhOkenH.js";import"./Popper-aoUur9H0.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
