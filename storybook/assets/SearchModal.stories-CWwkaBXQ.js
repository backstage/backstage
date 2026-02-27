import{j as t,Z as u,N as p,$ as g}from"./iframe-D342WmTn.js";import{r as h}from"./plugin-vx6fjido.js";import{S as l,u as c,a as x}from"./useSearchModal-D9MyM3ZC.js";import{s as S,M}from"./api-BTrYe2vX.js";import{S as C}from"./SearchContext-Bv5aOKdX.js";import{B as m}from"./Button-Bj3J30wS.js";import{m as f}from"./makeStyles-Dl2xR7o6.js";import{D as j,a as y,b as B}from"./DialogTitle-7kK5XVuf.js";import{B as D}from"./Box-SEVcZsv4.js";import{S as n}from"./Grid-DonucUYR.js";import{S as I}from"./SearchType-3nYOgW9u.js";import{L as G}from"./List-C_CbbNXo.js";import{H as R}from"./DefaultResultListItem-t88vlvri.js";import{w as k}from"./appWrappers-C6AX-mxK.js";import{SearchBar as v}from"./SearchBar-YUHY5X6i.js";import{S as T}from"./SearchResult-Br2Nocv7.js";import"./preload-helper-PPVm8Dsz.js";import"./index-aQOHZCwi.js";import"./Plugin-DnlI1SKS.js";import"./componentData-BQJEUhpR.js";import"./useAnalytics-BlpddQlR.js";import"./useApp-Da77ShEq.js";import"./useRouteRef-DzcrLTeN.js";import"./index-EeMuXrdv.js";import"./ArrowForward-C8SrqhTz.js";import"./translation-1HQ2H4wI.js";import"./Page-C_O5aP6c.js";import"./useMediaQuery-1S_0UWUH.js";import"./Divider-dvh6pOOF.js";import"./ArrowBackIos-DHDx4NOY.js";import"./ArrowForwardIos-DHmG3IRt.js";import"./translation-CkwsvNbf.js";import"./lodash-C2-_WstS.js";import"./useAsync-B04OMus7.js";import"./useMountedState-BNluGJjz.js";import"./Modal-D62txzus.js";import"./Portal-D4InWYUl.js";import"./Backdrop-DHju5-xy.js";import"./styled-SYFPJtfS.js";import"./ExpandMore-BFgvzGeJ.js";import"./AccordionDetails-Dhf4dUjN.js";import"./index-B9sM2jn7.js";import"./Collapse-DbFKF3cZ.js";import"./ListItem-BrpO8RHr.js";import"./ListContext-hf1vC8cB.js";import"./ListItemIcon-D8DgNdyM.js";import"./ListItemText-CJBKST13.js";import"./Tabs-DPUjYPGD.js";import"./KeyboardArrowRight-CnCClMFX.js";import"./FormLabel-hu7DYp1C.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BZP9Cs2b.js";import"./InputLabel-DHbEC4jS.js";import"./Select-Ba3gkRUn.js";import"./Popover-CCq25qdM.js";import"./MenuItem-BNMYlttS.js";import"./Checkbox-BXb9N9La.js";import"./SwitchBase-CaBcVQ0k.js";import"./Chip-IB04p21l.js";import"./Link-Dm3Vi_sn.js";import"./index-CeFL6QDR.js";import"./useObservable-c5Ssijv2.js";import"./useIsomorphicLayoutEffect-CNzqpcNs.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Ofkmc5KE.js";import"./useDebounce-M36uAiOW.js";import"./InputAdornment-m87PKjGi.js";import"./TextField-CPdHRH-a.js";import"./useElementFilter-DbI4fQo1.js";import"./EmptyState-BbSiSw8N.js";import"./Progress-D6UqWfHD.js";import"./LinearProgress-B8QrhXlX.js";import"./ResponseErrorPanel-BlylkLzC.js";import"./ErrorPanel-BejzLp58.js";import"./WarningPanel-BucODKgY.js";import"./MarkdownContent-BHItj7X2.js";import"./CodeSnippet-BX42FQI9.js";import"./CopyTextButton-Coyv0YUS.js";import"./useCopyToClipboard-CAP2hEgw.js";import"./Tooltip-BHw6Amth.js";import"./Popper-DdIQvNsr.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
