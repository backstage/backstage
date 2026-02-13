import{j as t,W as u,K as p,X as g}from"./iframe-DfpqVrvR.js";import{r as h}from"./plugin-M2iPVpm6.js";import{S as l,u as c,a as x}from"./useSearchModal-CF9pJ5JK.js";import{s as S,M}from"./api-CO6hh861.js";import{S as C}from"./SearchContext-BeYMF9OV.js";import{B as m}from"./Button-Depzz_zY.js";import{m as f}from"./makeStyles-D6lZMQOZ.js";import{D as j,a as y,b as B}from"./DialogTitle-LOUIfMaE.js";import{B as D}from"./Box-CBRqSsQo.js";import{S as n}from"./Grid-DytBiILQ.js";import{S as I}from"./SearchType-CkXSbmy4.js";import{L as G}from"./List-BZpx7np8.js";import{H as R}from"./DefaultResultListItem-BHIxksLb.js";import{w as k}from"./appWrappers-R6T-iis0.js";import{SearchBar as v}from"./SearchBar-s-3oRhRQ.js";import{S as T}from"./SearchResult-DCWCd1D3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CCffk5PF.js";import"./Plugin-DkofgBY6.js";import"./componentData-n0Ef26c2.js";import"./useAnalytics-BzwuJCU6.js";import"./useApp-CcVlq-lF.js";import"./useRouteRef-CCnEnygS.js";import"./index-Rl36dthR.js";import"./ArrowForward-fVMVJE7S.js";import"./translation-CtgtqVu8.js";import"./Page-Dvm4JFjN.js";import"./useMediaQuery-DJAnUDWF.js";import"./Divider-8A6u6vq7.js";import"./ArrowBackIos-mrTk2KVe.js";import"./ArrowForwardIos-BrSi1KJD.js";import"./translation-1cWDr4S_.js";import"./lodash-DSlsmB_-.js";import"./useAsync-BY1DWTpd.js";import"./useMountedState-BTmbzoDb.js";import"./Modal-BWu1sU36.js";import"./Portal-DJgbgmP8.js";import"./Backdrop-B6p1aNMg.js";import"./styled-Di8tq9jL.js";import"./ExpandMore-DNWj65uy.js";import"./AccordionDetails-CME4g-Zl.js";import"./index-B9sM2jn7.js";import"./Collapse-TeKBW-e6.js";import"./ListItem-vYcWevWl.js";import"./ListContext-rrXMk-NT.js";import"./ListItemIcon-BC-oLMvx.js";import"./ListItemText-DxxiQXUs.js";import"./Tabs-CjJ0I5UI.js";import"./KeyboardArrowRight-DDXsXuJQ.js";import"./FormLabel-DiK1MWEa.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-4531HN9P.js";import"./InputLabel-DRdVb8IE.js";import"./Select-DbAP1AuQ.js";import"./Popover-C_jE5Tn-.js";import"./MenuItem-B8BvW9Qj.js";import"./Checkbox-fYRAfZs0.js";import"./SwitchBase-sF7NyHe4.js";import"./Chip-KY9CxMnc.js";import"./Link-Ce-VQ3yZ.js";import"./index-DAuYgPgr.js";import"./useObservable-CimeOSxy.js";import"./useIsomorphicLayoutEffect-T1QybcqB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-D26opk2D.js";import"./useDebounce-CBQ3pGzA.js";import"./InputAdornment-B8kGoEv9.js";import"./TextField-_DduLuoO.js";import"./useElementFilter-C1YnKP-2.js";import"./EmptyState-Dk1CSN4M.js";import"./Progress-oTWT17G_.js";import"./LinearProgress-D6Jngapq.js";import"./ResponseErrorPanel-DVuxKWQn.js";import"./ErrorPanel-SmgUlzmO.js";import"./WarningPanel-Bz9AhhLa.js";import"./MarkdownContent-C7xGHzif.js";import"./CodeSnippet-nqnm0QRt.js";import"./CopyTextButton-CALliBhJ.js";import"./useCopyToClipboard-eV5LqnxG.js";import"./Tooltip-CSZ3KiFw.js";import"./Popper-BR9KmGwy.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
