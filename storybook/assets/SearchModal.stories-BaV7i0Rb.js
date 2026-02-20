import{j as t,W as u,K as p,X as g}from"./iframe-BAAMxX04.js";import{r as h}from"./plugin-B-IWom1K.js";import{S as l,u as c,a as x}from"./useSearchModal-DDxsKkjr.js";import{s as S,M}from"./api-50As9r0t.js";import{S as C}from"./SearchContext-Cijymp9H.js";import{B as m}from"./Button-BpZ_upXh.js";import{m as f}from"./makeStyles-Gcd-M5aY.js";import{D as j,a as y,b as B}from"./DialogTitle-BSPa7A2d.js";import{B as D}from"./Box-DWmyZ5Ze.js";import{S as n}from"./Grid-bsc20U2v.js";import{S as I}from"./SearchType-DTE4HvhH.js";import{L as G}from"./List-CWixwH1G.js";import{H as R}from"./DefaultResultListItem-BSe8gTTx.js";import{w as k}from"./appWrappers-BmtnESU-.js";import{SearchBar as v}from"./SearchBar-Cq0fuvcg.js";import{S as T}from"./SearchResult-8FYwRUCQ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CRd1em-_.js";import"./Plugin-dCnydjSu.js";import"./componentData-f2u_HJXq.js";import"./useAnalytics-BSrF4G5O.js";import"./useApp-CvcYQqjl.js";import"./useRouteRef-MEx9TA-1.js";import"./index-DV_MCKd1.js";import"./ArrowForward-DRy6Km1G.js";import"./translation-B_PO4KXy.js";import"./Page-CICe79lv.js";import"./useMediaQuery-Ccy9ZB3_.js";import"./Divider-DqEFMUKr.js";import"./ArrowBackIos-DHP6L7_e.js";import"./ArrowForwardIos-CTYhIm0K.js";import"./translation-D_MILFGb.js";import"./lodash-BcT4sL41.js";import"./useAsync-CkD-aj1D.js";import"./useMountedState-BHWFcdPM.js";import"./Modal-D0ZnfcKK.js";import"./Portal-DE326cIY.js";import"./Backdrop-d28P1hyd.js";import"./styled-x10YRlqs.js";import"./ExpandMore-BwjaEHfr.js";import"./AccordionDetails-DhHZDL5a.js";import"./index-B9sM2jn7.js";import"./Collapse-DxaSsTbo.js";import"./ListItem-BX7a0Z-y.js";import"./ListContext-COr9ityP.js";import"./ListItemIcon-PzTIHRnl.js";import"./ListItemText-CqW6ArUt.js";import"./Tabs-ohZQDE47.js";import"./KeyboardArrowRight-CZ_r7E3r.js";import"./FormLabel-BvXXxiUo.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-D3IphLUA.js";import"./InputLabel-CSL6nw83.js";import"./Select-x1Dasmcz.js";import"./Popover-Dneg8xTB.js";import"./MenuItem-Bw31wG1t.js";import"./Checkbox-t2asoAIm.js";import"./SwitchBase-DR9D41MO.js";import"./Chip-D9Y5oEkA.js";import"./Link-CvA_RcHM.js";import"./index-Ch5Cm9Ah.js";import"./useObservable-DYc4zXP3.js";import"./useIsomorphicLayoutEffect-DhTuVqBh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-B7w66D-U.js";import"./useDebounce-yki-Udw8.js";import"./InputAdornment-BzZL-mff.js";import"./TextField-BaQblRlm.js";import"./useElementFilter-BFkFQWnb.js";import"./EmptyState-4gFMMgF_.js";import"./Progress-BlDveVNz.js";import"./LinearProgress-C9Jcin2y.js";import"./ResponseErrorPanel-Bl3C5O1l.js";import"./ErrorPanel-DHN-LAtf.js";import"./WarningPanel-tIIxtRQY.js";import"./MarkdownContent-DQGrp438.js";import"./CodeSnippet-2B0aeiXb.js";import"./CopyTextButton-DBmI-hd9.js";import"./useCopyToClipboard-1oEsETe5.js";import"./Tooltip-Cow5tudN.js";import"./Popper-DxqnTNur.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
