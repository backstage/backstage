import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-CDQkRPtg.js";import{r as x}from"./plugin-Bv-eAaz3.js";import{S as l,u as c,a as S}from"./useSearchModal-DEFCixyz.js";import{s as M,M as C}from"./api-BzNEOoum.js";import{S as f}from"./SearchContext-DOtDp9Sx.js";import{B as m}from"./Button-CJBsb64p.js";import{D as j,a as y,b as B}from"./DialogTitle-DWkQ60T4.js";import{B as D}from"./Box-CFWJqO9C.js";import{S as n}from"./Grid-CLxLLrBH.js";import{S as I}from"./SearchType-B7BMiOqS.js";import{L as G}from"./List-Ciyy1sk9.js";import{H as R}from"./DefaultResultListItem-NYAkJ70i.js";import{w as k}from"./appWrappers-CE0QY808.js";import{SearchBar as v}from"./SearchBar-C9R2--Yn.js";import{S as T}from"./SearchResult-D6MJQi9j.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D6tZq3CL.js";import"./Plugin-7Q4zKQYi.js";import"./componentData-DYzzNs7d.js";import"./useAnalytics-SrifWrGy.js";import"./useApp-C8xAL1g0.js";import"./useRouteRef-BSUaPuHo.js";import"./index-SymPTtRB.js";import"./ArrowForward-hXXdPwwK.js";import"./translation-BWL_O6Kw.js";import"./Page-BZ8ijXHe.js";import"./useMediaQuery-aoA_kWuI.js";import"./Divider-o218nSC0.js";import"./ArrowBackIos-CZ5yAXWl.js";import"./ArrowForwardIos-CAQIaut-.js";import"./translation-BWVIsG1s.js";import"./lodash-m4O8l6WS.js";import"./useAsync-BT3fPnna.js";import"./useMountedState-C2nQ5XSq.js";import"./Modal-BVCBWYhk.js";import"./Portal-uMAxVVb4.js";import"./Backdrop-ZHSEXCO8.js";import"./styled-CcM8fDvt.js";import"./ExpandMore-Bwto4mGt.js";import"./AccordionDetails-Cp5Nx1Lx.js";import"./index-B9sM2jn7.js";import"./Collapse-DIN7Ymif.js";import"./ListItem-CsL3oSDi.js";import"./ListContext-C9VfLDtj.js";import"./ListItemIcon-DllUceRQ.js";import"./ListItemText-DHloRduP.js";import"./Tabs-DTiyaeV4.js";import"./KeyboardArrowRight-BfabCNpX.js";import"./FormLabel-BjdOaYPS.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B7ZD3Dgb.js";import"./InputLabel-BnA620d6.js";import"./Select-Bb02LF0r.js";import"./Popover-CXspRPX5.js";import"./MenuItem-CnoKRoPF.js";import"./Checkbox-DjShVqi-.js";import"./SwitchBase-DNXe7Qi6.js";import"./Chip-CNKQIOOg.js";import"./Link-BIWx4pmj.js";import"./useObservable-B4YdM9yx.js";import"./useIsomorphicLayoutEffect-bknZ9h7N.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DrVzFYyV.js";import"./useDebounce-DtOtbJ5n.js";import"./InputAdornment-DSEA8tWr.js";import"./TextField-C9nGHzrc.js";import"./useElementFilter-CZxwKGPX.js";import"./EmptyState-3JpD7dm7.js";import"./Progress-Zh8B1jbp.js";import"./LinearProgress-BjT5QAuw.js";import"./ResponseErrorPanel-DKY_Obn9.js";import"./ErrorPanel-BvnDxryc.js";import"./WarningPanel-DP_PPUp-.js";import"./MarkdownContent-aPcN5Cf2.js";import"./CodeSnippet-CRThj8mN.js";import"./CopyTextButton-D-Xv6vTC.js";import"./useCopyToClipboard-DyF_TS4U.js";import"./Tooltip-BVQgiQsu.js";import"./Popper-fSAvrd0-.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
