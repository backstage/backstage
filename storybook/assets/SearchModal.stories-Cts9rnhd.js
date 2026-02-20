import{j as t,W as u,K as p,X as g}from"./iframe-CXVefQjv.js";import{r as h}from"./plugin-p-lc7ia5.js";import{S as l,u as c,a as x}from"./useSearchModal-Bx6HouN8.js";import{s as S,M}from"./api-lSfc9dkh.js";import{S as C}from"./SearchContext-sbUMKdwl.js";import{B as m}from"./Button-UHEQpZ7Q.js";import{m as f}from"./makeStyles-cSB5pDml.js";import{D as j,a as y,b as B}from"./DialogTitle-DAgL9Wxr.js";import{B as D}from"./Box-D7AnzI4p.js";import{S as n}from"./Grid-hBNd94kt.js";import{S as I}from"./SearchType-BCYoBgsC.js";import{L as G}from"./List-S9fButJF.js";import{H as R}from"./DefaultResultListItem-Cyw-sCen.js";import{w as k}from"./appWrappers-D6Cdj31E.js";import{SearchBar as v}from"./SearchBar-uwb5EFAN.js";import{S as T}from"./SearchResult-BBmn2y_j.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CZEByppx.js";import"./Plugin-DANSs6yR.js";import"./componentData-CjALqQ4I.js";import"./useAnalytics-Bx4_U39Z.js";import"./useApp-DMj12Ulj.js";import"./useRouteRef-B_YwZax3.js";import"./index-B97xvfin.js";import"./ArrowForward-DoQSGnx0.js";import"./translation-DPydT9d-.js";import"./Page-DGJF8FNM.js";import"./useMediaQuery-CbRWZ-t3.js";import"./Divider-D5p3BC6A.js";import"./ArrowBackIos-CJ8KN6GO.js";import"./ArrowForwardIos-7TqjG967.js";import"./translation-D2g4ex6U.js";import"./lodash-DZtYjLW6.js";import"./useAsync-RkiDaN6_.js";import"./useMountedState-D7qdGVsq.js";import"./Modal-C62RgtH8.js";import"./Portal-BQuMmKqR.js";import"./Backdrop-iPqeXAMs.js";import"./styled-B7NpzSmh.js";import"./ExpandMore-ikIZxahA.js";import"./AccordionDetails-mtEEQxbQ.js";import"./index-B9sM2jn7.js";import"./Collapse-wHEE5AT7.js";import"./ListItem-CB67RL_O.js";import"./ListContext-x0Xd6oQC.js";import"./ListItemIcon-BXwAXp8r.js";import"./ListItemText-CJ-vbVsn.js";import"./Tabs-CQgmpBMD.js";import"./KeyboardArrowRight-BolqjStM.js";import"./FormLabel-DLCv-G59.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-xV6JXZGE.js";import"./InputLabel-C6RXyIAT.js";import"./Select-BIN4lGEu.js";import"./Popover-ByvpIW1H.js";import"./MenuItem-D7khMq-O.js";import"./Checkbox-DS18doxo.js";import"./SwitchBase-Cp0XsLVR.js";import"./Chip-CD13OLON.js";import"./Link-R8tlL6vJ.js";import"./index-CROf0-mb.js";import"./useObservable-D7_Ugrt_.js";import"./useIsomorphicLayoutEffect-CMVoBPLI.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-JMV9L8TM.js";import"./useDebounce-D2_LmXcJ.js";import"./InputAdornment-D4JrQ2Pg.js";import"./TextField-B3sAslhO.js";import"./useElementFilter-KPSAI9EK.js";import"./EmptyState-Dh56jIwZ.js";import"./Progress-DiPsxWjh.js";import"./LinearProgress-CWwAN_QO.js";import"./ResponseErrorPanel-BnmmaTTP.js";import"./ErrorPanel-MxtYpFuZ.js";import"./WarningPanel-nnuElF3h.js";import"./MarkdownContent-Dv_avCwS.js";import"./CodeSnippet-DpXSGNAU.js";import"./CopyTextButton-BSb2_Qop.js";import"./useCopyToClipboard-DAoWI8pP.js";import"./Tooltip-3hD40Mh0.js";import"./Popper-KPvihGZy.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
