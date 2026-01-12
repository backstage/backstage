import{j as t,m as u,I as p,b as g,T as h}from"./iframe-C8yOC2Gz.js";import{r as x}from"./plugin-CqVHvhmx.js";import{S as l,u as c,a as S}from"./useSearchModal-DD0sy42X.js";import{B as m}from"./Button-BKAaE2BP.js";import{a as M,b as C,c as f}from"./DialogTitle-BkYEluNi.js";import{B as j}from"./Box-CBcWlLgQ.js";import{S as n}from"./Grid-CFxNiZTj.js";import{S as y}from"./SearchType-HP3y6AWt.js";import{L as I}from"./List-BjKqLdFh.js";import{H as B}from"./DefaultResultListItem-WS8znA3o.js";import{s as D,M as G}from"./api-DzvCKpP9.js";import{S as R}from"./SearchContext-BBlgcE06.js";import{w as T}from"./appWrappers-BwqhmqR7.js";import{SearchBar as k}from"./SearchBar-CD3ywW6U.js";import{a as v}from"./SearchResult-D5pnA4K7.js";import"./preload-helper-PPVm8Dsz.js";import"./index-kU3y7djL.js";import"./Plugin-BKrfKbSW.js";import"./componentData-BzMhRHzP.js";import"./useAnalytics-CGjIDoIa.js";import"./useApp-_O_9FYmx.js";import"./useRouteRef-Csph2kF6.js";import"./index-CL1m9NR9.js";import"./ArrowForward-CyzdqpLN.js";import"./translation-CH_sbnlS.js";import"./Page-_N_KtytX.js";import"./useMediaQuery-DfxMb9sA.js";import"./Divider-9e41O7nq.js";import"./ArrowBackIos-B9cO5eTx.js";import"./ArrowForwardIos-D5QOlaTv.js";import"./translation-BzBjksML.js";import"./Modal-D0M0Hit_.js";import"./Portal-CjckT897.js";import"./Backdrop-CgVSzXAJ.js";import"./styled-Ci681tPu.js";import"./ExpandMore-DevN-S2O.js";import"./useAsync-A762jT4V.js";import"./useMountedState-Bkd0wkwf.js";import"./AccordionDetails-ClHZ_AqU.js";import"./index-B9sM2jn7.js";import"./Collapse-BMBJHt31.js";import"./ListItem-BMFOx_2Q.js";import"./ListContext-6MZEPlz1.js";import"./ListItemIcon-8Z3vHIwy.js";import"./ListItemText-CyJt0pMj.js";import"./Tabs-CiAb0BSV.js";import"./KeyboardArrowRight-BEHqXhAU.js";import"./FormLabel-BeCjxGFS.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CkAWgfq3.js";import"./InputLabel-CMoh8hhc.js";import"./Select-CBdak2wN.js";import"./Popover-BRQt0jP-.js";import"./MenuItem-BKUhuMxW.js";import"./Checkbox-C7d2Re-i.js";import"./SwitchBase-DCsA1uJZ.js";import"./Chip-DBaSR560.js";import"./Link-CUs49TGY.js";import"./lodash-DLuUt6m8.js";import"./useObservable-4Q7GBTuk.js";import"./useIsomorphicLayoutEffect-9KuYP6zf.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Ddzuy0fS.js";import"./useDebounce-BzTOHmC5.js";import"./InputAdornment-D9qWI13I.js";import"./TextField-DMfogsQu.js";import"./useElementFilter-BoiJjVFw.js";import"./EmptyState-OVctFcKM.js";import"./Progress-B8gfTFQ4.js";import"./LinearProgress-CzRNej5f.js";import"./ResponseErrorPanel-YzfhP_dB.js";import"./ErrorPanel-C1UVhDOE.js";import"./WarningPanel-k1eYB_NT.js";import"./MarkdownContent-C9TrxeVt.js";import"./CodeSnippet-CcjaZ8oG.js";import"./CopyTextButton-BJf8FGQ0.js";import"./useCopyToClipboard-Cdth3J8w.js";import"./Tooltip-BmRm86HZ.js";import"./Popper-DqIt_wBv.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
