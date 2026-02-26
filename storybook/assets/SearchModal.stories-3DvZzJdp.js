import{j as t,Z as u,N as p,$ as g}from"./iframe-DuvNW6Xv.js";import{r as h}from"./plugin-CBPOuOkT.js";import{S as l,u as c,a as x}from"./useSearchModal-n8MztZ9O.js";import{s as S,M}from"./api-Ccd-ZB-G.js";import{S as C}from"./SearchContext-CdqEcvGC.js";import{B as m}from"./Button-CrQJY2kf.js";import{m as f}from"./makeStyles-Z7w_QLhf.js";import{D as j,a as y,b as B}from"./DialogTitle-DPk8eVWL.js";import{B as D}from"./Box-DzPLR1xJ.js";import{S as n}from"./Grid-DlD5tHny.js";import{S as I}from"./SearchType-CxT2jds_.js";import{L as G}from"./List-BJbmfEoB.js";import{H as R}from"./DefaultResultListItem-CQ58SePC.js";import{w as k}from"./appWrappers-xFk9T2x3.js";import{SearchBar as v}from"./SearchBar-DX_-ON3R.js";import{S as T}from"./SearchResult-Cm1pLffX.js";import"./preload-helper-PPVm8Dsz.js";import"./index-rZQGa62e.js";import"./Plugin-DdIQuwB6.js";import"./componentData-7p5WJ3gq.js";import"./useAnalytics-C22xHozv.js";import"./useApp-CGYzobcC.js";import"./useRouteRef-st4voi5i.js";import"./index-Do6NpL29.js";import"./ArrowForward-DnddyHoX.js";import"./translation-HmKQu0ld.js";import"./Page-dVG0fkWS.js";import"./useMediaQuery-DP_ZhXQU.js";import"./Divider-CKD609da.js";import"./ArrowBackIos-Dx0yHCG9.js";import"./ArrowForwardIos-C3PaKTbf.js";import"./translation-DIkRI0pa.js";import"./lodash-D4DPSOUM.js";import"./useAsync-yNTUxeMe.js";import"./useMountedState-BooP3pH9.js";import"./Modal-CGrUoTEz.js";import"./Portal-C6ZvXkAX.js";import"./Backdrop-VO1UNcc-.js";import"./styled-D76g4fqW.js";import"./ExpandMore-sqgE5QyK.js";import"./AccordionDetails-BiJ-mohR.js";import"./index-B9sM2jn7.js";import"./Collapse-BQ2w7qDv.js";import"./ListItem-DO5emuSw.js";import"./ListContext-3Q_S_JMo.js";import"./ListItemIcon-ComOd2S4.js";import"./ListItemText-DTTp4AyK.js";import"./Tabs-CTC6q4iE.js";import"./KeyboardArrowRight-D2mzW4VH.js";import"./FormLabel-5An11EO7.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BHHnR_-k.js";import"./InputLabel-BXTIeKid.js";import"./Select-BllrwJg9.js";import"./Popover-DXuECRR4.js";import"./MenuItem-B-2cYH3l.js";import"./Checkbox-aj5edYvo.js";import"./SwitchBase-CnSiQGCs.js";import"./Chip-DHbpKpby.js";import"./Link-DuCnaZx-.js";import"./index-CyiwOViA.js";import"./useObservable-Cw9PrxeN.js";import"./useIsomorphicLayoutEffect-B7NJ_Hqy.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DjxQHUpj.js";import"./useDebounce-DjFBl-U-.js";import"./InputAdornment-Cpt7Vtqb.js";import"./TextField-DOkdJyZN.js";import"./useElementFilter-cvxSbSk5.js";import"./EmptyState-CDZWVKuH.js";import"./Progress-DywVT_Aa.js";import"./LinearProgress-DGHUE3pd.js";import"./ResponseErrorPanel-rSJCc7vj.js";import"./ErrorPanel-B_EyZMxb.js";import"./WarningPanel-BR2KDMvs.js";import"./MarkdownContent-Icvbeh_f.js";import"./CodeSnippet-DrhxvQnE.js";import"./CopyTextButton-CQP0vEjD.js";import"./useCopyToClipboard-B8sDKXDB.js";import"./Tooltip-BU-jYYLq.js";import"./Popper-DYeX4n5i.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
